mod handlers;
pub mod models;

use crate::users::handlers::find_all_users::find_all_users_handler;
use crate::users::handlers::{
    find_user_by_email::find_user_by_email_handler, find_user_by_uuid::find_user_by_uuid_handler,
};
use crate::users::models::user::User;
use crate::AppState;
use axum::routing::get;
use axum::Router;
use bson::doc;
use mongodb::options::IndexOptions;
use mongodb::{Client, IndexModel};

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/", get(find_all_users_handler))
        .route("/uuid/:user_uuid", get(find_user_by_uuid_handler))
        .route("/email/:user_email", get(find_user_by_email_handler))
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
