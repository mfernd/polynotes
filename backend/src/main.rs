mod auth;
mod db;
mod pages;
mod users;

use axum::Router;
use dotenvy::dotenv;
use mongodb::options::ClientOptions;
use mongodb::Client;
use tower_http::compression::CompressionLayer;

#[tokio::main]
async fn main() {
    dotenv().expect(".env file not found");

    let client = db::connect().await;
    println!(">>> Connected to MongoDB cluster");
    // TODO: static database connection

    // example: List the names of the collections in that database.
    let cursor = &client
        .database("polynotes-db")
        .list_collection_names(None)
        .await
        .unwrap();
    for collection_name in cursor {
        println!("{:?}", collection_name);
    }

    let api_routes = Router::new()
        .nest("/auth", auth::routes())
        .nest("/users", users::routes())
        .nest("/pages", pages::routes());

    let app = Router::new()
        .nest("/api/v1", api_routes)
        .layer(CompressionLayer::new());
    // .layer(CorsLayer::new());

    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
