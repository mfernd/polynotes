use crate::auth::error::AuthError;
use crate::auth::jwt::claims;
use crate::users::models::user::User;
use axum::{Extension, Json};
use serde_json::{json, Value};
use tower_cookies::Cookies;

pub async fn refresh_handler(
    Extension(user): Extension<User>,
    cookies: Cookies,
) -> Result<Json<Value>, AuthError> {
    // Send JWT through cookies
    claims::refresh_user_cookies(&cookies, user.uuid.to_string())?;

    Ok(Json(json!({"message": "ok"})))
}
