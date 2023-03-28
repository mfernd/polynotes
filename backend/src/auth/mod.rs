pub mod error;
mod handlers;
mod hash_utils;
pub mod jwt;

use crate::auth::handlers::{
    login::login_handler, logout::logout_handler, refresh::refresh_handler,
    register::register_handler, verify_email::verify_email_handler,
};
use crate::AppState;
use axum::routing::{get, post};
use axum::Router;
use tower_cookies::CookieManagerLayer;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/logout", get(logout_handler))
        .route("/refresh", get(refresh_handler))
        .route("/login", post(login_handler))
        .layer(CookieManagerLayer::new())
        .route("/register", post(register_handler))
        .route("/verify-email/:user_uuid", get(verify_email_handler))
}
