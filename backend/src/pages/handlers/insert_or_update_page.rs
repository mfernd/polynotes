use crate::api_error::ApiError;
use crate::pages::models::node::Node;
use crate::users::models::user::User;
use crate::AppState;
use axum::extract::State;
use axum::http::StatusCode;
use axum::{Extension, Json};
use axum_extra::extract::WithRejection;
use bson::{doc, Document};
use chrono::Utc;
use mongodb::options::UpdateOptions;
use serde::Deserialize;
use serde_json::{json, Value};
use uuid::Uuid;

#[derive(Debug, Deserialize)]
pub struct UpdatePageRequest {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub uuid: Option<Uuid>,
    pub title: String,
    pub nodes: Vec<Node>,
}

pub async fn insert_or_update_page_handler(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
    WithRejection(Json(payload), _): WithRejection<Json<UpdatePageRequest>, ApiError>,
) -> Result<Json<Value>, ApiError> {
    let user_id = user.id.ok_or(ApiError::new(
        StatusCode::UNAUTHORIZED,
        "User not authenticated",
    ))?;
    let timestamp_now = Utc::now().timestamp();
    let page_uuid = match payload.uuid {
        None => bson::Uuid::from_uuid_1(Uuid::new_v4()),
        Some(uuid) => bson::Uuid::from_uuid_1(uuid),
    };
    let nodes = Node::vec_to_bson(payload.nodes)?;

    let upsert = doc! {
        "$setOnInsert": {
            "author": user_id,
            "createdAt": timestamp_now,
        },
        "$set": {
            "uuid": page_uuid,
            "title": payload.title,
            "nodes": nodes,
            "updatedAt": timestamp_now,
        },
    };

    let options = UpdateOptions::builder().upsert(Some(true)).build();

    state
        .database
        .get_collection::<Document>("pages")
        .update_one(doc! {"uuid": page_uuid}, upsert, options)
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not create or update the page due to a problem in the server",
            )
        })?;

    let page_uuid = page_uuid.to_string();
    Ok(Json(json!({ "pageUuid": page_uuid })))
}
