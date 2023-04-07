use crate::api_error::ApiError;
use crate::users::models::abstracted_user::AbstractedUser;
use crate::AppState;
use axum::extract::State;
use axum::http::StatusCode;
use axum::Json;
use futures::TryStreamExt;
use mongodb::options::FindOptions;

pub async fn find_all_users_handler(
    State(state): State<AppState>,
) -> Result<Json<Vec<AbstractedUser>>, ApiError> {
    let options = FindOptions::builder()
        .projection(AbstractedUser::get_doc())
        // .limit(10)
        .build();

    let users: Vec<AbstractedUser> = state
        .database
        .get_collection::<AbstractedUser>("users")
        .find(None, options)
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not get users due to a problem in the server",
            )
        })?
        .try_collect()
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Error collecting users due to a problem in the server",
            )
        })?;

    Ok(Json(users))
}
