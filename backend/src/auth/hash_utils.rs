use argon2::Config;
use dotenvy::var;
use once_cell::sync::Lazy;

static PASSWORD_SALT: Lazy<String> =
    Lazy::new(|| var("PASSWORD_SALT").expect("PASSWORD_SALT must be provided in the .env file"));

pub fn hash(password: String) -> argon2::Result<String> {
    argon2::hash_encoded(
        password.as_bytes(),
        PASSWORD_SALT.as_bytes(),
        &Config::default(),
    )
}

pub fn verify_password(hash: String, password: String) -> bool {
    argon2::verify_encoded(hash.as_str(), password.as_bytes()).is_ok()
}
