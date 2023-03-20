use axum::http::StatusCode;
use axum::Json;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use validator::Validate;

pub async fn login_handler(Json(payload): Json<LoginRequest>) -> (StatusCode, Json<LoginResponse>) {
    println!("{:?}", payload);
    todo!()
}

#[derive(Debug, Deserialize, Validate)]
pub struct LoginRequest {
    #[validate(email)]
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub access_token: String,
    pub refresh_token: String,
}
