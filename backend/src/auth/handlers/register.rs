use crate::auth::hash_utils;
use crate::auth::{jwt::claims::ClaimType, jwt::claims::Claims, AuthError};
use crate::users::{AbstractedUser, User};
use crate::AppState;
use axum::extract::State;
use axum::{http::StatusCode, Json};
use axum_extra::extract::WithRejection;
use mongodb::error::{ErrorKind, WriteFailure};
use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
pub struct RegisterRequest {
    #[validate(length(min = 3))]
    pub username: String,
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 8))]
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct RegisterResponse {
    pub user: AbstractedUser,
    pub access_token: String,
}

pub async fn register_handler(
    State(state): State<AppState>,
    WithRejection(Json(payload), _): WithRejection<Json<RegisterRequest>, AuthError>,
) -> Result<(StatusCode, Json<RegisterResponse>), AuthError> {
    payload.validate().map_err(|_| AuthError::InvalidFields)?;

    let hashed_password = hash_utils::hash(payload.password)?;
    let new_user = User::new(payload.username, payload.email, hashed_password);

    state
        .database
        .get_collection::<User>("users")
        .insert_one(&new_user, None)
        .await
        .map_err(|err| match *err.kind {
            ErrorKind::Write(WriteFailure::WriteError(error)) if error.code == 11000 => {
                AuthError::UserConflict
            }
            _ => AuthError::CouldNotCreateAccount,
        })?;

    // TODO: Send a mail instead of returning a token
    let user_uuid = new_user.uuid.to_string();
    let token = Claims::new(Some(user_uuid), ClaimType::AccessToken).encode()?;

    let response = RegisterResponse {
        user: new_user.get_abstracted(),
        access_token: token,
    };

    Ok((StatusCode::CREATED, Json(response)))
}
