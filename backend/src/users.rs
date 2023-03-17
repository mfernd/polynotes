use axum::Router;
use serde::{Deserialize, Serialize};

pub fn routes() -> Router {
    Router::new()
}

#[derive(Debug, Deserialize, Serialize)]
struct User {
    username: String,
    email: String,
    password: String,
}
