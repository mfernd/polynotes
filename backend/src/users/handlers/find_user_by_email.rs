use crate::users::error::UserError;
use crate::AppState;
use axum::extract::{Path, State};
use axum::Json;
use bson::{doc, Document};
use mongodb::options::FindOneOptions;
use serde_json::{json, Value};

pub async fn find_user_by_email_handler(
    State(state): State<AppState>,
    Path(user_email): Path<String>,
) -> Result<Json<Value>, UserError> {
    let option = FindOneOptions::builder()
        .projection(doc! {"_id": 0, "username": 1, "email": 1, "role": 1})
        .build();

    let user = state
        .database
        .get_collection::<Document>("users")
        .find_one(doc! {"email": &user_email}, option)
        .await
        .map_err(|_| UserError::UserNotFound)?
        .ok_or(UserError::UserNotFound)?;

    Ok(Json(json!(user)))
}
