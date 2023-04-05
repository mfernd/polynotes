mod handlers;

use crate::pages::handlers::update_page::update_page_handler;
use crate::AppState;
use axum::routing::put;
use axum::Router;

pub fn routes() -> Router<AppState> {
    Router::new().route("/:pageId", put(update_page_handler))
}
