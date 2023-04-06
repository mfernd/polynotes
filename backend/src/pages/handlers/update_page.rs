use crate::api_error::ApiError;
use crate::pages::models::node::Node;
use crate::pages::models::page::Page;
use crate::users::models::user::User;
use crate::AppState;
use axum::extract::State;
use axum::http::StatusCode;
use axum::{Extension, Json};
use axum_extra::extract::WithRejection;
use bson::doc;
use mongodb::options::ReplaceOptions;
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

pub async fn update_page_handler(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
    WithRejection(Json(payload), _): WithRejection<Json<UpdatePageRequest>, ApiError>,
) -> Result<Json<Value>, ApiError> {
    let page = Page::new(payload.uuid, user, payload.title, payload.nodes);

    let options = ReplaceOptions::builder().upsert(Some(true)).build();

    state
        .database
        .get_collection::<Page>("pages")
        .replace_one(doc! {"uuid": page.uuid}, &page, options)
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not create or update the page due to a problem in the server",
            )
        })?;

    let page_uuid = page.uuid.to_string();
    Ok(Json(json!({ "pageUuid": page_uuid })))
}
