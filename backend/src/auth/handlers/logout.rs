use crate::auth::AuthError;
use axum::Json;
use serde_json::{json, Value};
use tower_cookies::cookie::time::OffsetDateTime;
use tower_cookies::{Cookie, Cookies};

pub async fn logout_handler(cookies: Cookies) -> Result<Json<Value>, AuthError> {
    // TODO: check if connected

    cookies.remove(
        Cookie::build("refresh_token", "")
            .expires(OffsetDateTime::now_utc())
            .finish(),
    );
    cookies.remove(
        Cookie::build("access_token", "")
            .expires(OffsetDateTime::now_utc())
            .finish(),
    );

    Ok(Json(json!({"message": "ok"})))
}
