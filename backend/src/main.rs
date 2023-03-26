extern crate argon2;
mod auth;
mod db;
mod pages;
mod users;

use crate::db::MongoDatabase;
use axum::Router;
use dotenvy::dotenv;
use tower_http::compression::CompressionLayer;

#[derive(Clone)]
pub struct AppState {
    database: MongoDatabase,
}

#[tokio::main]
async fn main() {
    dotenv().expect(".env file not found");

    let state = AppState {
        database: MongoDatabase::connect().await,
    };

    let api_routes = Router::new()
        .nest("/auth", auth::routes())
        .nest("/users", users::routes())
        .nest("/pages", pages::routes());

    let app = Router::new()
        .nest("/api/v1", api_routes)
        .with_state(state)
        .layer(CompressionLayer::new());

    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
