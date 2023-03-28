use crate::users::error::UserError;
use crate::AppState;
use axum::extract::State;
use axum::Json;
use bson::{doc, Document};
use futures::TryStreamExt;
use mongodb::options::FindOptions;
use serde_json::{json, Value};

pub async fn find_all_users_handler(
    State(state): State<AppState>,
) -> Result<Json<Value>, UserError> {
    let option = FindOptions::builder()
        .projection(doc! {"_id": 0, "username": 1, "email": 1, "role": 1})
        .limit(10)
        .build();

    let users: Vec<Document> = state
        .database
        .get_collection::<Document>("users")
        .find(None, option)
        .await
        .map_err(|_| UserError::InternalError)?
        .try_collect()
        .await
        .map_err(|_| UserError::InternalError)?;

    Ok(Json(json!(users)))
}