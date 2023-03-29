use axum::extract::rejection::{JsonRejection, PathRejection};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde_json::json;

#[derive(Debug)]
pub enum AuthError {
    InternalError,
    WrongCredentials,
    NotLogged,
    NotVerified,
    UserConflict,
    UserNotFound,
    CouldNotCreateAccount,
    CouldNotFetch,
    BadRequest,
}

impl From<JsonRejection> for AuthError {
    fn from(_: JsonRejection) -> AuthError {
        AuthError::BadRequest
    }
}

impl From<PathRejection> for AuthError {
    fn from(_: PathRejection) -> AuthError {
        AuthError::BadRequest
    }
}

impl IntoResponse for AuthError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            AuthError::InternalError => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "An unexpected error occurred on the server",
            ),
            AuthError::WrongCredentials => (StatusCode::UNAUTHORIZED, "Wrong credentials"),
            AuthError::NotLogged => (StatusCode::UNAUTHORIZED, "Not logged"),
            AuthError::NotVerified => (StatusCode::UNAUTHORIZED, "Your account is not verified"),
            AuthError::UserConflict => (
                StatusCode::CONFLICT,
                "User with the same email already exists",
            ),
            AuthError::UserNotFound => (StatusCode::NOT_FOUND, "User not found"),
            AuthError::CouldNotCreateAccount => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not create the account due to a problem in the server",
            ),
            AuthError::CouldNotFetch => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not fetch the account information due to a problem in the server",
            ),
            AuthError::BadRequest => (StatusCode::BAD_REQUEST, "Invalid or missing fields"),
        };

        let body = json!({ "error": error_message });

        (status, Json(body)).into_response()
    }
}
