use crate::auth::error::AuthError;
use crate::auth::jwt::claims;
use axum::Json;
use serde_json::{json, Value};
use tower_cookies::Cookies;

pub async fn refresh_handler(cookies: Cookies) -> Result<Json<Value>, AuthError> {
    // TODO: check if connected

    // Send JWT through cookies
    claims::refresh_user_cookies(&cookies, "test".to_owned())?;

    Ok(Json(json!({"message": "ok"})))
}
