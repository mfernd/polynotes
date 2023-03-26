use crate::auth::jwt::secret_keys::{JWT_ACCESS_KEYS, JWT_REFRESH_KEYS};
use crate::auth::AuthError;
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, Algorithm, Header, TokenData, Validation};
use serde::{Deserialize, Serialize};

/// JWT Claims
#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    #[serde(skip)]
    pub claim_type: ClaimType,
    pub sub: Option<String>,
    pub exp: i64,
    pub iat: i64,
}

#[derive(Debug, Default)]
pub enum ClaimType {
    #[default]
    AccessToken,
    RefreshToken,
}

impl Claims {
    pub fn new(sub: Option<String>, claim_type: ClaimType) -> Self {
        let now = Utc::now();

        match claim_type {
            ClaimType::AccessToken => Claims {
                claim_type,
                sub: Some(sub.unwrap()),
                exp: (now + Duration::minutes(15)).timestamp(),
                iat: now.timestamp(),
            },
            ClaimType::RefreshToken => Claims {
                claim_type,
                sub: None,
                exp: (now + Duration::weeks(1)).timestamp(),
                iat: now.timestamp(),
            },
        }
    }

    pub fn encode(&self) -> Result<String, AuthError> {
        let access_secret = &JWT_ACCESS_KEYS.encoding;
        let refresh_secret = &JWT_REFRESH_KEYS.encoding;

        match self.claim_type {
            ClaimType::AccessToken => encode(&Header::default(), &self, access_secret)
                .map_err(|_| AuthError::InternalError),
            ClaimType::RefreshToken => encode(&Header::default(), &self, refresh_secret)
                .map_err(|_| AuthError::InternalError),
        }
    }

    pub fn decode(token: String, claim_type: ClaimType) -> Result<TokenData<Claims>, AuthError> {
        let access_secret = &JWT_ACCESS_KEYS.decoding;
        let refresh_secret = &JWT_REFRESH_KEYS.decoding;

        match claim_type {
            ClaimType::AccessToken => {
                decode::<Claims>(&token, access_secret, &Validation::new(Algorithm::HS256))
                    .map_err(|_| AuthError::InternalError)
            }
            ClaimType::RefreshToken => {
                decode::<Claims>(&token, refresh_secret, &Validation::new(Algorithm::HS256))
                    .map_err(|_| AuthError::InternalError)
            }
        }
    }
}
