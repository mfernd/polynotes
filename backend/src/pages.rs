use crate::AppState;
use axum::Router;

pub fn routes() -> Router<AppState> {
    Router::new()
}
