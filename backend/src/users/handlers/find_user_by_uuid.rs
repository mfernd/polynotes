use crate::api_error::ApiError;
use crate::users::models::abstracted_user::AbstractedUser;
use crate::AppState;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::Json;
use axum_extra::extract::WithRejection;
use bson::doc;
use mongodb::options::FindOneOptions;
use uuid::Uuid;

pub async fn find_user_by_uuid_handler(
    State(state): State<AppState>,
    WithRejection(Path(user_uuid), _): WithRejection<Path<Uuid>, ApiError>,
) -> Result<Json<AbstractedUser>, ApiError> {
    let bson_uuid = bson::Uuid::from_uuid_1(user_uuid);

    let options = FindOneOptions::builder()
        .projection(AbstractedUser::get_doc())
        .build();

    let user = state
        .database
        .get_collection::<AbstractedUser>("users")
        .find_one(doc! {"uuid": &bson_uuid}, options)
        .await
        .map_err(|e| {
            println!("{:?}", e);
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not get user information due to a problem in the server",
            )
        })?
        .ok_or(ApiError::new(StatusCode::NOT_FOUND, "User not found"))?;

    Ok(Json(user))
}
