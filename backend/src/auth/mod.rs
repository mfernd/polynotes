mod handlers;
mod hash_utils;
mod jwt;

use crate::auth::handlers::{
    login::login_handler, logout::logout_handler, refresh::refresh_handler,
    register::register_handler, verify_email::verify_email_handler,
};
use axum::{
    extract::rejection::JsonRejection,
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};
use serde_json::json;

pub fn routes() -> Router {
    Router::new()
        .route("/register", post(register_handler))
        .route("/login", post(login_handler))
        .route("/logout", get(logout_handler))
        .route("/verify-email", post(verify_email_handler))
        .route("/refresh", get(refresh_handler)) // with cookie
}

#[derive(Debug)]
pub enum AuthError {
    WrongCredentials,
    NotVerified,
    UserConflict,
    InternalError,
    CouldNotCreateAccount,
    CouldNotFetch,
    BadRequest,
    InvalidFields,
}

impl From<JsonRejection> for AuthError {
    fn from(_: JsonRejection) -> AuthError {
        AuthError::BadRequest
    }
}

impl IntoResponse for AuthError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            AuthError::WrongCredentials => (StatusCode::UNAUTHORIZED, "Wrong credentials"),
            AuthError::NotVerified => (StatusCode::UNAUTHORIZED, "Your account is not verified"),
            AuthError::UserConflict => (
                StatusCode::CONFLICT,
                "User with the same email or username already exists",
            ),
            AuthError::InternalError => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "An unexpected error occurred on the server",
            ),
            AuthError::CouldNotCreateAccount => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not create the account due to a problem in the server",
            ),
            AuthError::CouldNotFetch => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not fetch the account information due to a problem in the server",
            ),
            AuthError::BadRequest => (StatusCode::BAD_REQUEST, "Error with your request"),
            AuthError::InvalidFields => (StatusCode::BAD_REQUEST, "Invalid or missing fields"),
        };

        let body = json!({ "error": error_message });

        (status, Json(body)).into_response()
    }
}
