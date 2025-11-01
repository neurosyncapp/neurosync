use borsh::{BorshDeserialize, BorshSerialize};

// Account discriminators (first byte of account data).
pub const TAG_CONFIG: u8 = 1;
pub const TAG_NAME: u8 = 2;
