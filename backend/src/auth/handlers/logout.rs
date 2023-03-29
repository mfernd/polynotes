use crate::auth::error::AuthError;
use axum::Json;
use serde_json::{json, Value};
use tower_cookies::cookie::time::Duration;
use tower_cookies::{Cookie, Cookies};

pub async fn logout_handler(cookies: Cookies) -> Result<Json<Value>, AuthError> {
    cookies.add(
        Cookie::build("access_token", "")
            .path("/api/v1")
            .max_age(Duration::MIN)
            .finish(),
    );
    cookies.add(
        Cookie::build("refresh_token", "")
            .path("/api/v1/auth")
            .max_age(Duration::MIN)
            .finish(),
    );

    Ok(Json(json!({"message": "ok"})))
}
