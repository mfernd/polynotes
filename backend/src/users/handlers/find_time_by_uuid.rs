use crate::api_error::ApiError;
use crate::users::models::time::Time;
use crate::users::models::user::User;
use crate::AppState;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::{Extension, Json};
use axum_extra::extract::WithRejection;
use futures::StreamExt;
use uuid::Uuid;

pub async fn find_time_by_uuid_handler(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
    WithRejection(Path((user_uuid, time_uuid)), _): WithRejection<Path<(Uuid, Uuid)>, ApiError>,
) -> Result<Json<Time>, ApiError> {
    user.check_permissions(user_uuid)?;

    let pipeline = Time::get_all_times_pipeline(user_uuid, Some(time_uuid));

    let time = state
        .database
        .get_collection::<User>("users")
        .aggregate(pipeline, None)
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not get the time due to a problem in the server",
            )
        })?
        .next()
        .await
        .ok_or(ApiError::new(StatusCode::NOT_FOUND, "Time not found"))?
        .map(bson::from_document::<Time>)
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not deserialize the time due to a problem in the server",
            )
        })?
        .map_err(|_| ApiError::new(StatusCode::NOT_FOUND, "Time not found"))?;

    Ok(Json(time))
}
