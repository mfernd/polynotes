use axum::extract::rejection::{JsonRejection, PathRejection};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde_json::json;

#[derive(Debug)]
pub struct ApiError(pub StatusCode, pub String);

impl ApiError {
    pub fn new(status: StatusCode, message: &str) -> Self {
        Self(status, message.to_owned())
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let body = json!({ "error": self.1 });

        (self.0, Json(body)).into_response()
    }
}

impl From<JsonRejection> for ApiError {
    fn from(_: JsonRejection) -> ApiError {
        ApiError(
            StatusCode::BAD_REQUEST,
            "Invalid or missing fields".to_owned(),
        )
    }
}

impl From<PathRejection> for ApiError {
    fn from(_: PathRejection) -> ApiError {
        ApiError(
            StatusCode::BAD_REQUEST,
            "Invalid or missing parameters in path".to_owned(),
        )
    }
}
