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
