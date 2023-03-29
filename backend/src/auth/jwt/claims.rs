use crate::auth::error::AuthError;
use crate::auth::jwt::secret_keys::{JWT_ACCESS_KEYS, JWT_REFRESH_KEYS};
use chrono::Utc;
use jsonwebtoken::{decode, encode, Algorithm, Header, TokenData, Validation};
use serde::{Deserialize, Serialize};
use tower_cookies::cookie::time;
use tower_cookies::{Cookie, Cookies};

/// JWT Claims
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    #[serde(skip)]
    pub claim_type: ClaimType,
    pub sub: Option<String>,
    pub exp: i64,
    pub iat: i64,
}

#[derive(Debug, Default, Clone)]
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
                sub,
                exp: (now + chrono::Duration::minutes(15)).timestamp(),
                iat: now.timestamp(),
            },
            ClaimType::RefreshToken => Claims {
                claim_type,
                sub,
                exp: (now + chrono::Duration::weeks(1)).timestamp(),
                iat: now.timestamp(),
            },
        }
    }

    pub fn get_cookie(&self) -> Result<Cookie, AuthError> {
        let token = self.encode()?;

        match self.claim_type {
            ClaimType::AccessToken => Ok(Cookie::build("access_token", token)
                .max_age(time::Duration::minutes(15))
                .path("/api/v1")
                .http_only(true)
                .secure(true)
                .finish()),
            ClaimType::RefreshToken => Ok(Cookie::build("refresh_token", token)
                .max_age(time::Duration::weeks(1))
                .path("/api/v1/auth")
                .http_only(true)
                .secure(true)
                .finish()),
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

pub fn refresh_user_cookies(cookies: &Cookies, sub: String) -> Result<(), AuthError> {
    let refresh = Claims::new(Some(sub.clone()), ClaimType::RefreshToken);
    let access = Claims::new(Some(sub), ClaimType::AccessToken);

    let refresh_cookie = refresh.get_cookie()?;
    let access_cookie = access.get_cookie()?;

    cookies.add(refresh_cookie.into_owned());
    cookies.add(access_cookie.into_owned());

    Ok(())
}
