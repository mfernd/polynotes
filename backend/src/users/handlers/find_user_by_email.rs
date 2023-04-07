use crate::api_error::ApiError;
use crate::users::models::abstracted_user::AbstractedUser;
use crate::AppState;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::Json;
use bson::doc;
use mongodb::options::FindOneOptions;

pub async fn find_user_by_email_handler(
    State(state): State<AppState>,
    Path(user_email): Path<String>,
) -> Result<Json<AbstractedUser>, ApiError> {
    let options = FindOneOptions::builder()
        .projection(AbstractedUser::get_doc())
        .build();

    let user = state
        .database
        .get_collection::<AbstractedUser>("users")
        .find_one(doc! {"email": &user_email}, options)
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not get user information due to a problem in the server",
            )
        })?
        .ok_or(ApiError::new(StatusCode::NOT_FOUND, "User not found"))?;

    Ok(Json(user))
}
