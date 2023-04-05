mod handlers;
mod hash_utils;
pub mod jwt;

use crate::auth::handlers::{
    login::login_handler, logout::logout_handler, refresh::refresh_handler,
    register::register_handler, verify_email::verify_email_handler,
};
use crate::middlewares::auth_guard;
use crate::AppState;
use axum::middleware::from_fn_with_state;
use axum::routing::{get, post};
use axum::Router;
use tower_cookies::CookieManagerLayer;

pub fn routes(state: &AppState) -> Router<AppState> {
    let access_token_route = Router::new()
        .route("/logout", get(logout_handler))
        .route_layer(from_fn_with_state(
            state.clone(),
            auth_guard::access_token_extractor,
        ));

    let refresh_token_route = Router::new()
        .route("/refresh", get(refresh_handler))
        .route_layer(from_fn_with_state(
            state.clone(),
            auth_guard::refresh_token_extractor,
        ));

    let unsecured_route = Router::new()
        .route("/login", post(login_handler))
        .route("/register", post(register_handler))
        .route("/verify-email/:user_uuid", get(verify_email_handler));

    Router::new()
        .merge(access_token_route)
        .merge(refresh_token_route)
        .merge(unsecured_route)
        .layer(CookieManagerLayer::new())
}
