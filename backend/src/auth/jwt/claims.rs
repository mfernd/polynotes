use crate::auth::jwt::secret_keys::JWT_KEYS;
use crate::auth::AuthError;
use chrono::{Duration, Utc};
use jsonwebtoken::{encode, Header};
use serde::{Deserialize, Serialize};

/// JWT Claims
#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub exp: i64,
    pub iat: i64,
}

impl Claims {
    pub fn new(sub: String) -> Self {
        let now = Utc::now();
        let expire_in = now + Duration::minutes(15);

        Claims {
            sub,
            exp: expire_in.timestamp(),
            iat: now.timestamp(),
        }
    }

    pub fn get_token(&self) -> Result<String, AuthError> {
        encode(&Header::default(), &self, &JWT_KEYS.encoding).map_err(|_| AuthError::InternalError)
    }
}
