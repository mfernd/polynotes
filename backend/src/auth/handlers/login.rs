use crate::api_error::ApiError;
use crate::auth::hash_utils::verify_password;
use crate::auth::jwt::claims;
use crate::users::models::abstracted_user::AbstractedUser;
use crate::users::models::user::User;
use crate::AppState;
use axum::extract::State;
use axum::http::StatusCode;
use axum::Json;
use axum_extra::extract::WithRejection;
use bson::doc;
use log::info;
use serde::{Deserialize, Serialize};
use tower_cookies::Cookies;
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
pub struct LoginRequest {
    #[validate(email)]
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub user: AbstractedUser,
}

pub async fn login_handler(
    cookies: Cookies,
    State(state): State<AppState>,
    WithRejection(Json(payload), _): WithRejection<Json<LoginRequest>, ApiError>,
) -> Result<Json<LoginResponse>, ApiError> {
    payload
        .validate()
        .map_err(|_| ApiError::new(StatusCode::BAD_REQUEST, "Invalid or missing fields"))?;

    let user = state
        .database
        .get_collection::<User>("users")
        .find_one(doc! {"email": payload.email}, None)
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not fetch the account information due to a problem in the server",
            )
        })?
        .ok_or(ApiError::new(StatusCode::UNAUTHORIZED, "Wrong credentials"))?;

    if !user.check_is_verified() {
        return Err(ApiError::new(
            StatusCode::UNAUTHORIZED,
            "Your account is not verified",
        ));
    }

    if !verify_password(&user.password, &payload.password) {
        return Err(ApiError::new(StatusCode::UNAUTHORIZED, "Wrong credentials"));
    }

    // Send JWT through cookies
    claims::refresh_user_cookies(&cookies, user.uuid.to_string())?;

    let user_email = &user.email;
    let user_uuid = user.uuid.to_string();
    info!("User \"{user_email}\" [{user_uuid}] logged in");

    let response = LoginResponse {
        user: user.get_abstracted(),
    };
    Ok(Json(response))
}
