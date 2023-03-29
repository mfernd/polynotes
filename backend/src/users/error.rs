use axum::extract::rejection::{JsonRejection, PathRejection};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde_json::json;

#[derive(Debug)]
pub enum UserError {
    InternalError,
    BadRequest,
    UserNotFound,
}

impl From<JsonRejection> for UserError {
    fn from(_: JsonRejection) -> UserError {
        UserError::BadRequest
    }
}

impl From<PathRejection> for UserError {
    fn from(_: PathRejection) -> UserError {
        UserError::BadRequest
    }
}

impl IntoResponse for UserError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            UserError::InternalError => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "An unexpected error occurred on the server",
            ),
            UserError::BadRequest => (StatusCode::BAD_REQUEST, "Invalid or missing fields"),
            UserError::UserNotFound => (StatusCode::NOT_FOUND, "User not found"),
        };

        let body = json!({ "error": error_message });

        (status, Json(body)).into_response()
    }
}
