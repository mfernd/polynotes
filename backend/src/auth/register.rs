use crate::auth::{jwt::claims::Claims, AuthError};
use crate::db;
use crate::users::{AbstractedUser, User};
use axum::{http::StatusCode, Json};
use axum_extra::extract::WithRejection;
use bson::Document;
use serde::{Deserialize, Serialize};
use validator::Validate;

pub async fn register_handler(
    WithRejection(Json(payload), _): WithRejection<Json<RegisterRequest>, AuthError>,
) -> Result<(StatusCode, Json<RegisterResponse>), AuthError> {
    if payload.validate().is_err() {
        return Err(AuthError::InvalidFields);
    }

    let new_user = User::new(payload.username, payload.email, payload.password);
    let serialized_new_user = bson::to_bson(&new_user)
        .ok()
        .ok_or(AuthError::InternalError)?;
    let document = serialized_new_user
        .as_document()
        .ok_or(AuthError::InternalError)?;

    // TODO: use static database connection
    db::connect()
        .await
        .database("polynotes-db")
        .collection::<&Document>("users")
        .insert_one(&document, None)
        .await
        .expect("TODO: panic message");

    // TODO: send an email instead of a token
    let token = Claims::new(new_user.uuid.to_string()).get_token()?;

    let response = RegisterResponse {
        user: new_user.get_abstracted(),
        access_token: token,
    };

    Ok((StatusCode::CREATED, Json(response)))
}

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
