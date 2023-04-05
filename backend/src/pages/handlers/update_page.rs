use crate::api_error::ApiError;
use axum::Json;
use serde_json::{json, Value};

pub async fn update_page_handler() -> Result<Json<Value>, ApiError> {
    Ok(Json(json!({ "message": "updated" })))
}
