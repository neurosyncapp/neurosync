use solana_program::program_error::ProgramError;
use thiserror::Error;

#[derive(Error, Debug, Copy, Clone)]
pub enum NeuroError {
    #[error("Invalid instruction data")]
    InvalidInstruction,
    #[error("Name already registered")]
    AlreadyRegistered,
    #[error("Name not registered")]
