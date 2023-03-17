use crate::users::{User, UserRole};
use axum::{
    routing::{get, post},
    Form, Json, Router,
};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use validator::Validate;

pub fn routes() -> Router {
    Router::new()
        .route("/register", post(register))
        .route("/login", post(login))
        .route("/logout", get(logout))
}

// JWT
#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    iat: u64,
    exp: u64,
}

// created status code: 201
#[derive(Debug, Deserialize, Validate)]
struct RegisterRequest {
    #[validate(length(min = 3))]
    username: String,
    #[validate(email)]
    email: String,
    #[validate(length(min = 8))]
    password: String,
}

struct RegisterResponse {
    user: User,
    token: Claims,
}

async fn register(Form(register_form): Form<RegisterRequest>) -> Json<RegisterResponse> {
    let new_user = User {
        username: register_form.username,
        email: register_form.email,
        password: register_form.password,
        role: UserRole::User,
    };

    let response = RegisterResponse {
        user: new_user,
        token: Claims {
            sub: "0123456789".to_owned(),
            iat: 0,
            exp: 0,
        },
    };

    Json(response)
}

// status code: 200
async fn login() -> Json<Value> {
    todo!()
}

// status code: 200
async fn logout() -> Json<Value> {
    todo!()
}
