use crate::error::NeuroError;
use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct InitConfigArgs {
    pub treasury: [u8; 32],
    pub register_fee_lamports: u64,
    pub renew_fee_lamports: u64,
    pub period_seconds: i64,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct RegisterArgs {
    pub label: String,
    pub metadata_uri: String,
    pub resolver: [u8; 32],
}

#[derive(Debug)]
pub enum NeuroInstruction {
    /// 0. Initialise (or, via UpdateConfig, change) the registry config PDA.
    /// Accounts: [admin(signer,w), config_pda(w), system_program]
    InitConfig(InitConfigArgs),
    /// 1. Update economics. Accounts: [admin(signer), config_pda(w)]
    UpdateConfig(InitConfigArgs),
