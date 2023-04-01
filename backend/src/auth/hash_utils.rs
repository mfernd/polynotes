use crate::auth::error::AuthError;
use argon2::Config;
use dotenvy::var;
use once_cell::sync::Lazy;

static PASSWORD_SALT: Lazy<String> =
    Lazy::new(|| var("PASSWORD_SALT").expect("PASSWORD_SALT must be provided in the .env file"));

pub fn hash(password: String) -> Result<String, AuthError> {
    let hashed_password = argon2::hash_encoded(
        password.as_bytes(),
        PASSWORD_SALT.as_bytes(),
        &Config::default(),
    )
    .map_err(|_| AuthError::InternalError)?;

    Ok(hashed_password)
}

pub fn verify_password(hash: &str, password: &str) -> bool {
    argon2::verify_encoded(hash, password.as_bytes()).unwrap_or(false)
}
