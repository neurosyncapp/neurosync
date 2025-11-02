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
pub struct Config {
    pub admin: [u8; 32],
    pub treasury: [u8; 32],
    pub register_fee_lamports: u64,
    pub renew_fee_lamports: u64,
    pub period_seconds: i64,
    pub bump: u8,
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct NameRecord {
    pub owner: [u8; 32],
    pub resolver: [u8; 32],
    pub registered_at: i64,
    pub expires_at: i64, // 0 => never expires
    pub last_heartbeat: i64,
    pub heartbeat_count: u64,
    pub bump: u8,
    pub label: String,
    pub metadata_uri: String,
}

impl Config {
    pub fn load(data: &[u8]) -> Option<Config> {
        if data.is_empty() || data[0] != TAG_CONFIG {
            return None;
        }
        let mut slice = &data[1..];
        Config::deserialize(&mut slice).ok()
    }

    pub fn store(&self, data: &mut [u8]) -> Result<(), std::io::Error> {
        data[0] = TAG_CONFIG;
        let mut cursor = &mut data[1..];
        self.serialize(&mut cursor)
    }
}

impl NameRecord {
    pub fn load(data: &[u8]) -> Option<NameRecord> {
        if data.is_empty() || data[0] != TAG_NAME {
            return None;
        }
        // Use deserialize (not try_from_slice) so trailing reserved zero bytes
        // in the fixed-size account are ignored.
        let mut slice = &data[1..];
        NameRecord::deserialize(&mut slice).ok()
    }

    pub fn store(&self, data: &mut [u8]) -> Result<(), std::io::Error> {
