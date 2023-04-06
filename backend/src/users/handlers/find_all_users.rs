use crate::api_error::ApiError;
use crate::AppState;
use axum::extract::State;
use axum::http::StatusCode;
use axum::Json;
use bson::{doc, Document};
use futures::TryStreamExt;
use mongodb::options::FindOptions;
use serde_json::{json, Value};

pub async fn find_all_users_handler(
    State(state): State<AppState>,
) -> Result<Json<Value>, ApiError> {
    let options = FindOptions::builder()
        .projection(doc! {"_id": 0, "username": 1, "email": 1, "role": 1})
        .limit(10)
        .build();

    let users: Vec<Document> = state
        .database
        .get_collection::<Document>("users")
        .find(None, options)
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not get users due to a problem in the server",
            )
        })?
        .try_collect()
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Error collecting users due to a problem in the server",
            )
        })?;

    Ok(Json(json!(users)))
}
