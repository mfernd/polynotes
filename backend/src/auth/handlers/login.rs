use crate::auth::hash_utils::verify_password;
use crate::auth::jwt::claims::{ClaimType, Claims};
use crate::auth::AuthError;
use crate::users::User;
use axum::extract::State;
use axum::Json;
use axum_extra::extract::WithRejection;
use serde::{Deserialize, Serialize};

use crate::AppState;
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
pub struct LoginRequest {
    #[validate(email)]
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub access_token: String,
    pub refresh_token: String,
}

pub async fn login_handler(
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

    if !user.is_verified {
        return Err(AuthError::NotVerified);
    }

    if !verify_password(user.password.clone(), payload.password.clone()) {
        return Err(AuthError::WrongCredentials);
    }

    let user_uuid = user.uuid.to_string();
    let response = LoginResponse {
        access_token: Claims::new(Some(user_uuid), ClaimType::AccessToken).encode()?,
        refresh_token: Claims::new(None, ClaimType::RefreshToken).encode()?,
    };
    Ok(Json(response))
}
