use solana_program::program_error::ProgramError;
use thiserror::Error;

#[derive(Error, Debug, Copy, Clone)]
pub enum NeuroError {
    #[error("Invalid instruction data")]
    InvalidInstruction,
    #[error("Name already registered")]
    AlreadyRegistered,
    #[error("Name not registered")]
    NotRegistered,
    #[error("Not the owner")]
    NotOwner,
    #[error("Invalid PDA")]
    InvalidPda,
    #[error("Invalid config account")]
    InvalidConfig,
    #[error("Invalid treasury account")]
    InvalidTreasury,
    #[error("Label too long or empty")]
    InvalidLabel,
    #[error("Metadata URI too long")]
    InvalidUri,
    #[error("Missing required signature")]
    MissingSignature,
}

impl From<NeuroError> for ProgramError {
    fn from(e: NeuroError) -> Self {
        ProgramError::Custom(e as u32)
