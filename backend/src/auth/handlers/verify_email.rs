use crate::api_error::ApiError;
use crate::users::models::user::User;
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
    WithRejection(Path(user_uuid), _): WithRejection<Path<Uuid>, ApiError>,
    Query(query): Query<NonceQuery>,
) -> Result<(StatusCode, Json<Value>), ApiError> {
    let bson_uuid = bson::Uuid::from(user_uuid);

    // Get the user
    let mut user = state
        .database
        .get_collection::<User>("users")
        .find_one(doc! {"uuid": bson_uuid}, None)
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not get your account due to a problem in the server",
            )
        })?
        .ok_or(ApiError::new(StatusCode::NOT_FOUND, "User not found"))?;

    if user.check_is_verified() {
        let message = json!({ "message": "Account already verified" });
        return Ok((StatusCode::OK, Json(message)));
    } else if user.nonce != Some(query.nonce) {
        return Err(ApiError::new(
            StatusCode::UNAUTHORIZED,
            "Wrong nonce in your query",
        ));
    }

    // Reset the nonce
    user.is_verified = true;
    user.nonce = None;
    state
        .database
        .get_collection::<User>("users")
        .replace_one(doc! {"uuid": bson_uuid}, &user, None)
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not verify your account due to a problem in the server",
            )
        })?;

    let message = json!({ "message": "Account successfully verified" });
    Ok((StatusCode::OK, Json(message)))
}
