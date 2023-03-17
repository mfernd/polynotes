use axum::{
    routing::{get, post},
    Json, Router,
};
use serde_json::Value;

pub fn routes() -> Router {
    Router::new()
        .route("/register", post(register))
        .route("/login", post(login))
        .route("/logout", get(logout))
}

// created status code: 201
async fn register() -> Json<Value> {
    todo!()
}

// status code: 200
async fn login() -> Json<Value> {
    todo!()
}

// status code: 200
async fn logout() -> Json<Value> {
    todo!()
}
