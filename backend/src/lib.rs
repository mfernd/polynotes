extern crate argon2;

mod api_error;
mod auth;
mod db;
mod mailer;
mod middlewares;
mod pages;
mod times;
mod users;

use crate::db::MongoDatabase;
use crate::mailer::LettreMailer;
use crate::middlewares::auth_guard;
use crate::users::models::user::User;
use axum::middleware::from_fn_with_state;
use axum::routing::get;
use axum::{Extension, Json, Router};
use dotenvy::var;
use log::info;
use serde_json::{json, Value};
use tower_http::compression::CompressionLayer;
use tower_http::cors::CorsLayer;

#[derive(Debug, Clone)]
pub struct AppState {
    database: MongoDatabase,
    mailer: LettreMailer,
}

pub async fn create_server() {
    pretty_env_logger::init_timed();
    let port = var("APP_PORT").unwrap_or("3000".to_owned());

    let state = AppState {
        database: MongoDatabase::new().await,
        mailer: LettreMailer::new().await,
    };

    let secured_routes = Router::new()
        .route("/secured_route", get(secured_route))
        .route_layer(from_fn_with_state(
            state.clone(),
            auth_guard::access_token_extractor,
        ));

    let api_routes = Router::new()
        .route("/health", get(health_handler))
        .merge(secured_routes)
        .nest("/auth", auth::routes(&state))
        .nest("/users", users::routes(&state))
        .nest("/pages", pages::routes(&state))
        .nest("/times", times::routes(&state));

    let app = Router::new()
        .nest("/api/v1", api_routes)
        .with_state(state)
        .layer(CorsLayer::very_permissive())
        .layer(CompressionLayer::new());

    let server_addr = format!("0.0.0.0:{port}");
    info!("Server starting on {server_addr}");

    axum::Server::bind(&server_addr.parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn secured_route(Extension(user): Extension<User>) -> Json<Value> {
    println!("{user:?}");

    Json(json!({ "isAuthorized": true }))
}

async fn health_handler() -> Json<Value> {
    Json(json!({ "isOk": "healthy ❤️" }))
}
