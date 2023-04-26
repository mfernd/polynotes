use crate::api_error::ApiError;
use crate::users::models::user::User;
use crate::AppState;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::{Extension, Json};
use axum_extra::extract::WithRejection;
use bson::{doc, Document};
use mongodb::options::FindOneOptions;
use uuid::Uuid;

pub async fn find_all_projects_handler(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
    WithRejection(Path(user_uuid), _): WithRejection<Path<Uuid>, ApiError>,
) -> Result<Json<Document>, ApiError> {
    user.check_permissions(user_uuid)?;

    let projects = find_all(&state, TimeFields::Projects, user_uuid).await?;

    Ok(Json(projects))
}

pub async fn find_all_tags_handler(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
    WithRejection(Path(user_uuid), _): WithRejection<Path<Uuid>, ApiError>,
) -> Result<Json<Document>, ApiError> {
    user.check_permissions(user_uuid)?;

    let tags = find_all(&state, TimeFields::Tags, user_uuid).await?;

    Ok(Json(tags))
}

enum TimeFields {
    Projects,
    Tags,
}

async fn find_all(
    state: &AppState,
    field: TimeFields,
    user_uuid: Uuid,
) -> Result<Document, ApiError> {
    let options = match field {
        TimeFields::Projects => FindOneOptions::builder()
            .projection(doc! { "_id": 0, "projects": "$timeTracker.projects" })
            .build(),
        TimeFields::Tags => FindOneOptions::builder()
            .projection(doc! { "_id": 0, "tags": "$timeTracker.tags" })
            .build(),
    };

    let result = state
        .database
        .get_collection::<Document>("users")
        .find_one(doc! { "uuid": user_uuid }, options)
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not get the projects/tags due to a problem in the server",
            )
        })?
        .ok_or(ApiError::new(
            StatusCode::NOT_FOUND,
            "Resource not found (user or user's projects/tags)",
        ))?;

    Ok(result)
}
