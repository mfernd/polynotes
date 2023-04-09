use crate::api_error::ApiError;
use argon2::Config;
use axum::http::StatusCode;
use dotenvy::var;
use once_cell::sync::Lazy;

static PASSWORD_SALT: Lazy<String> = Lazy::new(|| {
    var("PASSWORD_SALT").expect("PASSWORD_SALT must be provided in the .env.locale file")
});

pub fn hash(password: String) -> Result<String, ApiError> {
    let hashed_password = argon2::hash_encoded(
        password.as_bytes(),
        PASSWORD_SALT.as_bytes(),
        &Config::default(),
    )
    .map_err(|_| {
        ApiError::new(
        StatusCode::INTERNAL_SERVER_ERROR,
        "Could not create your account due to a problem in the server (error hashing the password)")
    })?;

    Ok(hashed_password)
}

pub fn verify_password(hash: &str, password: &str) -> bool {
    argon2::verify_encoded(hash, password.as_bytes()).unwrap_or(false)
}
