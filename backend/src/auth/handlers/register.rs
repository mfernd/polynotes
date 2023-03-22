use crate::auth::hash_utils;
use crate::auth::{jwt::claims::ClaimType, jwt::claims::Claims, AuthError};
use crate::db::Mongo;
use crate::users::{AbstractedUser, User};
use axum::{http::StatusCode, Json};
use axum_extra::extract::WithRejection;
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
    WithRejection(Json(payload), _): WithRejection<Json<RegisterRequest>, AuthError>,
) -> Result<(StatusCode, Json<RegisterResponse>), AuthError> {
    if payload.validate().is_err() {
        return Err(AuthError::InvalidFields);
    }

    let hashed_password = hash_utils::hash(payload.password)?;
    let new_user = User::new(payload.username, payload.email, hashed_password);

    Mongo::get_collection::<User>("users")
        .insert_one(&new_user, None)
        .await
        .map_err(|_| AuthError::CouldNotCreateAccount)?;

    // TODO: Send a mail instead of returning a token
    let user_uuid = new_user.uuid.to_string();
    let token = Claims::new(Some(user_uuid), ClaimType::AccessToken).encode()?;

    let response = RegisterResponse {
        user: new_user.get_abstracted(),
        access_token: token,
    };

    Ok((StatusCode::CREATED, Json(response)))
}
