use crate::api_error::ApiError;
use crate::AppState;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::Json;
use axum_extra::extract::WithRejection;
use bson::{doc, Document};
use mongodb::options::FindOneOptions;
use serde_json::{json, Value};
use uuid::Uuid;

pub async fn find_user_by_uuid_handler(
    State(state): State<AppState>,
    WithRejection(Path(user_uuid), _): WithRejection<Path<Uuid>, ApiError>,
) -> Result<Json<Value>, ApiError> {
    let bson_uuid = bson::Uuid::from_uuid_1(user_uuid);

    let option = FindOneOptions::builder()
        .projection(doc! {"_id": 0, "username": 1, "email": 1, "role": 1})
        .build();

    let user = state
        .database
        .get_collection::<Document>("users")
        .find_one(doc! {"uuid": &bson_uuid}, option)
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not get user information due to a problem in the server",
            )
        })?
        .ok_or(ApiError::new(StatusCode::NOT_FOUND, "User not found"))?;

    Ok(Json(json!(user)))
}
