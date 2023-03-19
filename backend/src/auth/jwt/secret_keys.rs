use dotenvy::var;
use jsonwebtoken::{DecodingKey, EncodingKey};
use once_cell::sync::Lazy;

/// Lazily set this const with decoding/encoding JWT Keys
pub static JWT_KEYS: Lazy<JwtKeys> = Lazy::new(|| {
    let encoding_secret = var("JWT_SECRET").expect("JWT_SECRET must be provided in the .env file");
    JwtKeys::new(encoding_secret.as_bytes())
});

pub struct JwtKeys {
    pub encoding: EncodingKey,
    pub decoding: DecodingKey,
}

impl JwtKeys {
    fn new(secret: &[u8]) -> Self {
        Self {
            encoding: EncodingKey::from_secret(secret),
            decoding: DecodingKey::from_secret(secret),
        }
    }
}
