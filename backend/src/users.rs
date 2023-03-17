use axum::Router;
use serde::{Deserialize, Serialize};

pub fn routes() -> Router {
    Router::new()
}

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub username: String,
    pub email: String,
    pub password: String,
    pub role: UserRole,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum UserRole {
    Admin,
    User,
}
