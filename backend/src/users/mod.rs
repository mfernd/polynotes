mod handlers;
pub mod models;

use crate::middlewares::auth_guard;
use crate::users::handlers::{
    find_all_users::find_all_users_handler, find_user_by_email::find_user_by_email_handler,
    find_user_by_uuid::find_user_by_uuid_handler, find_user_pages::find_user_pages_handler,
};
use crate::users::models::user::User;
use crate::AppState;
use axum::middleware::from_fn_with_state;
use axum::routing::get;
use axum::Router;
use bson::doc;
use mongodb::options::IndexOptions;
use mongodb::{Client, IndexModel};

pub fn routes(state: &AppState) -> Router<AppState> {
    Router::new()
        .route("/pages", get(find_user_pages_handler))
        .route("/", get(find_all_users_handler))
        .route("/uuid/:user_uuid", get(find_user_by_uuid_handler))
        .route("/email/:user_email", get(find_user_by_email_handler))
        .route_layer(from_fn_with_state(
            state.clone(),
            auth_guard::access_token_extractor,
        ))
}

pub async fn create_users_indexes(client: &Client, db_name: &str) {
    // Uuid unique index
    let uuid_options = IndexOptions::builder().unique(true).build();
    let uuid_index = IndexModel::builder()
        .keys(doc! {"uuid": 1})
        .options(uuid_options)
        .build();

    client
        .database(db_name)
        .collection::<User>("users")
        .create_index(uuid_index, None)
        .await
        .expect("error creating the user (uuid) index");

    // Email unique index
    let email_options = IndexOptions::builder().unique(true).build();
    let email_index = IndexModel::builder()
        .keys(doc! {"email": 1})
        .options(email_options)
        .build();

    client
        .database(db_name)
        .collection::<User>("users")
        .create_index(email_index, None)
        .await
        .expect("error creating the user (email) index");
}
