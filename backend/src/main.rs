mod auth;
mod pages;
mod users;

use axum::Router;
use tower_http::compression::CompressionLayer;

#[tokio::main]
async fn main() {
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
