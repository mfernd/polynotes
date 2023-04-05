mod handlers;
pub mod models;

use crate::users::handlers::find_all_users::find_all_users_handler;
use crate::users::handlers::{
    find_user_by_email::find_user_by_email_handler, find_user_by_uuid::find_user_by_uuid_handler,
};
use crate::AppState;
use axum::routing::get;
use axum::Router;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/", get(find_all_users_handler))
        .route("/uuid/:user_uuid", get(find_user_by_uuid_handler))
        .route("/email/:user_email", get(find_user_by_email_handler))
}
