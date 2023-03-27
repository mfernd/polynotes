use crate::auth::error::AuthError;
use crate::auth::hash_utils::verify_password;
use crate::auth::jwt::claims;
use crate::users::{AbstractedUser, User};
use crate::AppState;
use axum::extract::State;
use axum::Json;
use axum_extra::extract::WithRejection;
use bson::doc;
use serde::{Deserialize, Serialize};
use tower_cookies::Cookies;
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
pub struct LoginRequest {
    #[validate(email)]
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub user: AbstractedUser,
}

pub async fn login_handler(
    cookies: Cookies,
    State(state): State<AppState>,
    WithRejection(Json(payload), _): WithRejection<Json<LoginRequest>, AuthError>,
) -> Result<Json<LoginResponse>, AuthError> {
    payload.validate().map_err(|_| AuthError::BadRequest)?;

    let user = state
        .database
        .get_collection::<User>("users")
        .find_one(None, None)
        .await
        .map_err(|_| AuthError::CouldNotFetch)?
        .ok_or(AuthError::WrongCredentials)?;

    if !user.check_is_verified() {
        return Err(AuthError::NotVerified);
    }

    if !verify_password(user.password.clone(), payload.password.clone()) {
        return Err(AuthError::WrongCredentials);
    }

    // Send JWT through cookies
    claims::refresh_user_cookies(&cookies, user.uuid.to_string())?;

    let response = LoginResponse {
        user: user.get_abstracted(),
    };
    Ok(Json(response))
}
