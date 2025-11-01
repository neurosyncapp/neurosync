use borsh::{BorshDeserialize, BorshSerialize};

// Account discriminators (first byte of account data).
pub const TAG_CONFIG: u8 = 1;
pub const TAG_NAME: u8 = 2;

// Fixed space reserved per name account so metadata can be updated in place
// without reallocation. 1 tag + record fields + room for label/uri.
pub const NAME_ACCOUNT_SPACE: usize = 512;
pub const CONFIG_ACCOUNT_SPACE: usize = 128;

pub const MAX_LABEL_LEN: usize = 32;
pub const MAX_URI_LEN: usize = 200;

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
