mod handlers;
pub mod models;

use crate::AppState;
use axum::Router;
use bson::{doc, Document};
use mongodb::options::IndexOptions;
use mongodb::{Client, IndexModel};

pub fn routes(_state: &AppState) -> Router<AppState> {
    Router::new()
}

pub async fn create_times_indexes(client: &Client, db_name: &str) {
    // Uuid unique index
    let uuid_options = IndexOptions::builder().unique(true).build();
    let uuid_index = IndexModel::builder()
        .keys(doc! {"uuid": 1})
        .options(uuid_options)
        .build();

    client
        .database(db_name)
        .collection::<Document>("times")
        .create_index(uuid_index, None)
        .await
        .expect("error creating the times (uuid) index");
}
