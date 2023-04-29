use crate::api_error::ApiError;
use crate::users::models::user::User;
use crate::AppState;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::{Extension, Json};
use axum_extra::extract::WithRejection;
use bson::doc;
use serde_json::{json, Value};
use uuid::Uuid;

pub async fn delete_time_by_uuid_handler(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
    WithRejection(Path((user_uuid, time_uuid)), _): WithRejection<Path<(Uuid, Uuid)>, ApiError>,
) -> Result<Json<Value>, ApiError> {
    user.check_permissions(user_uuid)?;

    let query = doc! { "uuid": user_uuid };
    let update = doc! {
        "$pull": {
            "timeTracker.times": { "uuid": time_uuid },
        },
    };

    let result = state
        .database
        .get_collection::<User>("users")
        .update_one(query, update, None)
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not delete the time due to a problem in the server",
            )
        })?;

    if result.modified_count < 1 {
        return Err(ApiError::new(
            StatusCode::NOT_FOUND,
            "Could not delete the time, because it was not found",
        ));
    }

    Ok(Json(json!({ "message": "Time deleted successfully" })))
}
