use crate::api_error::ApiError;
use crate::users::models::time::Time;
use crate::users::models::user::User;
use crate::AppState;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::{Extension, Json};
use axum_extra::extract::WithRejection;
use bson::doc;
use uuid::Uuid;
use validator::Validate;

pub async fn insert_or_update_time_handler(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
    WithRejection(Path(user_uuid), _): WithRejection<Path<Uuid>, ApiError>,
    WithRejection(Json(time), _): WithRejection<Json<Time>, ApiError>,
) -> Result<Json<Time>, ApiError> {
    user.check_permissions(user_uuid)?;

    // validate time data
    if let Err(err) = time.validate() {
        let err_msg = format!("The time data is malformed, more info:\n{}", err);
        return Err(ApiError::new(StatusCode::BAD_REQUEST, &err_msg));
    }

    // transform to bson
    let bson_time_doc = bson::to_bson(&time).map_err(|_| {
        ApiError::new(
            StatusCode::BAD_REQUEST,
            "The time data is malformed, could not save it",
        )
    })?;

    let _ = state
        .database
        .get_collection::<User>("users")
        .update_one(
            doc! { "uuid": user_uuid },
            doc! { "$pull": { "timeTracker.times": { "uuid": time.uuid } } },
            None,
        )
        .await;

    let update = doc! {
        "$addToSet": {
            "timeTracker.projects": time.project.as_str(),
            "timeTracker.tags": { "$each": Time::extract_tags(&time.description) },
        },
        "$push": { "timeTracker.times": bson_time_doc },
    };

    let result = state
        .database
        .get_collection::<User>("users")
        .update_one(doc! { "uuid": user_uuid }, update, None)
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not create or update the time due to a problem in the server",
            )
        })?;

    if result.matched_count == 0 {
        return Err(ApiError::new(
            StatusCode::NOT_FOUND,
            "Could not create or update the time, because the user was not found",
        ));
    }

    Ok(Json(time))
}
