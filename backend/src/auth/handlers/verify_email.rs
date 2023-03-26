use crate::auth::AuthError;
use crate::users::User;
use crate::AppState;
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use axum_extra::extract::WithRejection;
use bson::doc;
use serde::Deserialize;
use serde_json::{json, Value};
use uuid::Uuid;

#[derive(Debug, Deserialize)]
pub struct NonceQuery {
    pub nonce: String,
}

pub async fn verify_email_handler(
    State(state): State<AppState>,
    WithRejection(Path(user_uuid), _): WithRejection<Path<Uuid>, AuthError>,
    Query(query): Query<NonceQuery>,
) -> Result<(StatusCode, Json<Value>), AuthError> {
    let bson_uuid = bson::Uuid::from(user_uuid);

    // Get the user
    let mut user = state
        .database
        .get_collection::<User>("users")
        .find_one(doc! {"uuid": bson_uuid}, None)
        .await
        .map_err(|_| AuthError::UserNotFound)?
        .ok_or(AuthError::UserNotFound)?;

    if user.check_is_verified() {
        let message = json!({"message": "account already verified"});
        return Ok((StatusCode::OK, Json(message)));
    } else if user.nonce != Some(query.nonce) {
        return Err(AuthError::UserNotFound);
    }

    // Reset the nonce
    user.is_verified = true;
    user.nonce = None;
    state
        .database
        .get_collection::<User>("users")
        .replace_one(doc! {"uuid": bson_uuid}, &user, None)
        .await
        .map_err(|_| AuthError::InternalError)?;

    let message = json!({"message": "account successfully verified"});
    Ok((StatusCode::OK, Json(message)))
}