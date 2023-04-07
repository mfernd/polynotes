use crate::api_error::ApiError;
use crate::pages::models::short_page::ShortPage;
use crate::users::models::user::User;
use crate::AppState;
use axum::extract::State;
use axum::http::StatusCode;
use axum::{Extension, Json};
use bson::doc;
use futures::TryStreamExt;
use mongodb::options::FindOptions;

pub async fn find_user_pages_handler(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
) -> Result<Json<Vec<ShortPage>>, ApiError> {
    let filter = doc! {"author": user.id.unwrap()};

    let options = FindOptions::builder()
        .projection(ShortPage::get_doc())
        .build();

    let pages: Vec<ShortPage> = state
        .database
        .get_collection::<ShortPage>("pages")
        .find(filter, options)
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not get user pages due to a problem in the server",
            )
        })?
        .try_collect()
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Error collecting user pages due to a problem in the server",
            )
        })?;

    Ok(Json(pages))
}
