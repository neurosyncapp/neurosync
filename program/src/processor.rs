use solana_program::{
    account_info::{next_account_info, AccountInfo},
    clock::Clock,
    entrypoint::ProgramResult,
    hash::hash,
    msg,
    program::{invoke, invoke_signed},
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
    system_program,
    sysvar::Sysvar,
};

use crate::error::NeuroError;
use crate::instruction::{InitConfigArgs, NeuroInstruction, RegisterArgs};
use crate::state::{
    Config, NameRecord, CONFIG_ACCOUNT_SPACE, MAX_LABEL_LEN, MAX_URI_LEN, NAME_ACCOUNT_SPACE,
};

pub fn process(program_id: &Pubkey, accounts: &[AccountInfo], data: &[u8]) -> ProgramResult {
    match NeuroInstruction::unpack(data)? {
        NeuroInstruction::InitConfig(args) => init_config(program_id, accounts, args, true),
        NeuroInstruction::UpdateConfig(args) => init_config(program_id, accounts, args, false),
        NeuroInstruction::Register(args) => register(program_id, accounts, args),
        NeuroInstruction::Heartbeat => heartbeat(program_id, accounts),
        NeuroInstruction::UpdateResolver { resolver } => {
            update_resolver(program_id, accounts, resolver)
        }
        NeuroInstruction::UpdateMetadata { metadata_uri } => {
            update_metadata(program_id, accounts, metadata_uri)
        }
        NeuroInstruction::Transfer { new_owner } => transfer(program_id, accounts, new_owner),
        NeuroInstruction::Renew => renew(program_id, accounts),
    }
}

fn config_seeds(program_id: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(&[b"config"], program_id)
}

fn name_seeds(program_id: &Pubkey, label: &str) -> (Pubkey, u8) {
    let h = hash(label.as_bytes());
    Pubkey::find_program_address(&[b"name", h.as_ref()], program_id)
}

fn validate_label(label: &str) -> Result<(), NeuroError> {
    if label.is_empty() || label.len() > MAX_LABEL_LEN {
        return Err(NeuroError::InvalidLabel);
    }
    if !label
        .bytes()
        .all(|b| b.is_ascii_lowercase() || b.is_ascii_digit() || b == b'-')
    {
        return Err(NeuroError::InvalidLabel);
    }
    Ok(())
}

fn init_config(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    args: InitConfigArgs,
    create: bool,
) -> ProgramResult {
    let it = &mut accounts.iter();
    let admin = next_account_info(it)?;
    let config_ai = next_account_info(it)?;

    if !admin.is_signer {
        return Err(NeuroError::MissingSignature.into());
    }
    let (config_key, bump) = config_seeds(program_id);
    if config_key != *config_ai.key {
        return Err(NeuroError::InvalidPda.into());
    }

    if create {
        let system = next_account_info(it)?;
        if config_ai.data_is_empty() {
            let rent = Rent::get()?;
            let lamports = rent.minimum_balance(CONFIG_ACCOUNT_SPACE);
            invoke_signed(
                &system_instruction::create_account(
                    admin.key,
                    config_ai.key,
                    lamports,
                    CONFIG_ACCOUNT_SPACE as u64,
                    program_id,
                ),
                &[admin.clone(), config_ai.clone(), system.clone()],
                &[&[b"config", &[bump]]],
            )?;
        }
    } else {
        // UpdateConfig: must already exist and admin must match.
        let existing = Config::load(&config_ai.data.borrow()).ok_or(NeuroError::InvalidConfig)?;
        if existing.admin != admin.key.to_bytes() {
            return Err(NeuroError::NotOwner.into());
        }
    }

    let cfg = Config {
        admin: admin.key.to_bytes(),
        treasury: args.treasury,
        register_fee_lamports: args.register_fee_lamports,
        renew_fee_lamports: args.renew_fee_lamports,
        period_seconds: args.period_seconds,
        bump,
    };
    cfg.store(&mut config_ai.data.borrow_mut())?;
    msg!("config set");
    Ok(())
}

fn register(program_id: &Pubkey, accounts: &[AccountInfo], args: RegisterArgs) -> ProgramResult {
    let it = &mut accounts.iter();
    let payer = next_account_info(it)?;
    let name_ai = next_account_info(it)?;
    let config_ai = next_account_info(it)?;
    let treasury = next_account_info(it)?;
    let system = next_account_info(it)?;

    if !payer.is_signer {
        return Err(NeuroError::MissingSignature.into());
    }
    validate_label(&args.label)?;
    if args.metadata_uri.len() > MAX_URI_LEN {
        return Err(NeuroError::InvalidUri.into());
    }
    if !name_ai.data_is_empty() {
        return Err(NeuroError::AlreadyRegistered.into());
    }

    let (name_key, bump) = name_seeds(program_id, &args.label);
    if name_key != *name_ai.key {
        return Err(NeuroError::InvalidPda.into());
    }

    let (config_key, _) = config_seeds(program_id);
    if config_key != *config_ai.key {
        return Err(NeuroError::InvalidPda.into());
    }
    let cfg = Config::load(&config_ai.data.borrow()).ok_or(NeuroError::InvalidConfig)?;
    if cfg.treasury != treasury.key.to_bytes() {
        return Err(NeuroError::InvalidTreasury.into());
    }

    // Collect the registration fee.
    if cfg.register_fee_lamports > 0 {
        invoke(
            &system_instruction::transfer(payer.key, treasury.key, cfg.register_fee_lamports),
            &[payer.clone(), treasury.clone(), system.clone()],
        )?;
    }

    // Create the name account (program-owned, fixed space).
    let h = hash(args.label.as_bytes());
    let rent = Rent::get()?;
    let lamports = rent.minimum_balance(NAME_ACCOUNT_SPACE);
    invoke_signed(
        &system_instruction::create_account(
            payer.key,
            name_ai.key,
            lamports,
            NAME_ACCOUNT_SPACE as u64,
            program_id,
        ),
        &[payer.clone(), name_ai.clone(), system.clone()],
        &[&[b"name", h.as_ref(), &[bump]]],
    )?;

    let now = Clock::get()?.unix_timestamp;
    let expires_at = if cfg.period_seconds > 0 {
        now + cfg.period_seconds
    } else {
        0
    };
    let record = NameRecord {
        owner: payer.key.to_bytes(),
        resolver: args.resolver,
        registered_at: now,
        expires_at,
        last_heartbeat: 0,
        heartbeat_count: 0,
        bump,
        label: args.label,
        metadata_uri: args.metadata_uri,
    };
    record.store(&mut name_ai.data.borrow_mut())?;
    msg!("registered {}", record.label);
    Ok(())
}

fn load_owned(name_ai: &AccountInfo, program_id: &Pubkey) -> Result<NameRecord, ProgramError> {
    if name_ai.owner != program_id {
        return Err(NeuroError::NotRegistered.into());
    }
    NameRecord::load(&name_ai.data.borrow()).ok_or(NeuroError::NotRegistered.into())
}

fn require_owner(name_ai: &AccountInfo, owner: &AccountInfo, program_id: &Pubkey) -> Result<NameRecord, ProgramError> {
    if !owner.is_signer {
        return Err(NeuroError::MissingSignature.into());
    }
    let record = load_owned(name_ai, program_id)?;
    if record.owner != owner.key.to_bytes() {
        return Err(NeuroError::NotOwner.into());
    }
    Ok(record)
}

fn heartbeat(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let it = &mut accounts.iter();
    let owner = next_account_info(it)?;
    let name_ai = next_account_info(it)?;
    let mut record = require_owner(name_ai, owner, program_id)?;
    record.last_heartbeat = Clock::get()?.unix_timestamp;
    record.heartbeat_count = record.heartbeat_count.saturating_add(1);
    record.store(&mut name_ai.data.borrow_mut())?;
    Ok(())
}

fn update_resolver(program_id: &Pubkey, accounts: &[AccountInfo], resolver: [u8; 32]) -> ProgramResult {
