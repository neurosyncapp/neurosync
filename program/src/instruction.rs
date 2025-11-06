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
    /// 2. Register a name. Accounts: [payer(signer,w), name_pda(w), config_pda, treasury(w), system_program]
    Register(RegisterArgs),
    /// 3. Heartbeat. Accounts: [owner(signer), name_pda(w)]
    Heartbeat,
    /// 4. Update resolver. Accounts: [owner(signer), name_pda(w)]
    UpdateResolver { resolver: [u8; 32] },
    /// 5. Update metadata uri. Accounts: [owner(signer), name_pda(w)]
    UpdateMetadata { metadata_uri: String },
    /// 6. Transfer ownership. Accounts: [owner(signer), name_pda(w)]
    Transfer { new_owner: [u8; 32] },
    /// 7. Renew. Accounts: [payer(signer,w), name_pda(w), config_pda, treasury(w), system_program]
    Renew,
}

impl NeuroInstruction {
    pub fn unpack(data: &[u8]) -> Result<Self, NeuroError> {
        let (&tag, rest) = data.split_first().ok_or(NeuroError::InvalidInstruction)?;
        Ok(match tag {
            0 => NeuroInstruction::InitConfig(
                InitConfigArgs::try_from_slice(rest).map_err(|_| NeuroError::InvalidInstruction)?,
            ),
            1 => NeuroInstruction::UpdateConfig(
                InitConfigArgs::try_from_slice(rest).map_err(|_| NeuroError::InvalidInstruction)?,
            ),
            2 => NeuroInstruction::Register(
                RegisterArgs::try_from_slice(rest).map_err(|_| NeuroError::InvalidInstruction)?,
            ),
            3 => NeuroInstruction::Heartbeat,
            4 => {
                let resolver = <[u8; 32]>::try_from_slice(rest)
                    .map_err(|_| NeuroError::InvalidInstruction)?;
                NeuroInstruction::UpdateResolver { resolver }
            }
            5 => {
                let metadata_uri =
                    String::try_from_slice(rest).map_err(|_| NeuroError::InvalidInstruction)?;
                NeuroInstruction::UpdateMetadata { metadata_uri }
            }
            6 => {
                let new_owner = <[u8; 32]>::try_from_slice(rest)
                    .map_err(|_| NeuroError::InvalidInstruction)?;
                NeuroInstruction::Transfer { new_owner }
            }
            7 => NeuroInstruction::Renew,
            _ => return Err(NeuroError::InvalidInstruction),
