use crate::api_error::ApiError;
use crate::users::models::user::User;
use crate::AppState;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::{Extension, Json};
use axum_extra::extract::WithRejection;
use bson::{doc, Document};
use futures::TryStreamExt;
use uuid::Uuid;

pub async fn get_stats_on_projects_handler(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
    WithRejection(Path(user_uuid), _): WithRejection<Path<Uuid>, ApiError>,
) -> Result<Json<Vec<Document>>, ApiError> {
    user.check_permissions(user_uuid)?;

    let pipeline: Vec<Document> = vec![
        doc! { "$match": { "uuid": user_uuid } },
        doc! { "$unwind": "$timeTracker.times" },
        doc! {
          "$group": {
            "_id": "$timeTracker.times.project",
            "count": { "$count": {} },
            "duration": { "$sum": "$timeTracker.times.duration" },
          },
        },
        doc! {
          "$project": {
            "_id": 0,
            "project": "$_id",
            "count": 1,
            "duration": 1,
          },
        },
    ];

    let result = state
        .database
        .get_collection::<User>("users")
        .aggregate(pipeline, None)
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not get the projects stats due to a problem in the server",
            )
        })?
        .try_collect::<Vec<Document>>()
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not get the projects stats due to a problem in the server",
            )
        })?;

    Ok(Json(result))
}
