use crate::api_error::ApiError;
use crate::pages::models::page::Page;
use crate::users::models::user::User;
use crate::AppState;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::{Extension, Json};
use axum_extra::extract::WithRejection;
use bson::{doc, Uuid};
use serde_json::{json, Value};

pub async fn delete_page_by_uuid_handler(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
    WithRejection(Path(page_uuid), _): WithRejection<Path<Uuid>, ApiError>,
) -> Result<Json<Value>, ApiError> {
    let user_id = user.id.ok_or(ApiError::new(
        StatusCode::UNAUTHORIZED,
        "User not authenticated",
    ))?;

    let query = doc! {
        "uuid": page_uuid,
        "author": user_id,
    };

    let deleted_result = state
        .database
        .get_collection::<Page>("pages")
        .delete_one(query, None)
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not delete the page due to a problem in the server",
            )
        })?;

    if deleted_result.deleted_count == 0 {
        return Err(ApiError::new(StatusCode::NOT_FOUND, "Page not found"));
    }

    Ok(Json(json!({ "message": "Page deleted" })))
}
