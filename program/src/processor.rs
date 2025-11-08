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
