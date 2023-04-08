use crate::api_error::ApiError;
use crate::pages::models::short_page::ShortPage;
use crate::users::models::user::User;
use crate::AppState;
use axum::extract::{Query, State};
use axum::http::StatusCode;
use axum::{Extension, Json};
use bson::doc;
use futures::TryStreamExt;
use mongodb::options::FindOptions;
use serde::Deserialize;
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
pub struct Params {
    #[validate(range(min = 1, max = 20))]
    pub limit: Option<i64>,
}

pub async fn find_recent_pages_handler(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
    Query(params): Query<Params>,
) -> Result<Json<Vec<ShortPage>>, ApiError> {
    if params.limit.is_some() && params.validate().is_err() {
        return Err(ApiError::new(
            StatusCode::BAD_REQUEST,
            "Your limit parameter needs to be between 1 and 20",
        ));
    }
    let user_id = user.id.ok_or(ApiError::new(
        StatusCode::UNAUTHORIZED,
        "User not authenticated",
    ))?;

    let options = FindOptions::builder()
        .projection(ShortPage::get_doc())
        .sort(doc! {"updatedAt": -1})
        .limit(params.limit.unwrap_or(10))
        .build();

    let pages: Vec<ShortPage> = state
        .database
        .get_collection::<ShortPage>("pages")
        .find(doc! {"author": user_id}, options)
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not get recent pages due to a problem in the server",
            )
        })?
        .try_collect()
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Error collecting recent pages due to a problem in the server",
            )
        })?;

    Ok(Json(pages))
}
