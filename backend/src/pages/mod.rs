mod handlers;
mod models;

use crate::middlewares::auth_guard;
use crate::pages::handlers::find_page_by_uuid::find_page_by_uuid_handler;
use crate::pages::handlers::update_page::update_page_handler;
use crate::pages::models::page::Page;
use crate::AppState;
use axum::middleware::from_fn_with_state;
use axum::routing::{get, put};
use axum::Router;
use bson::doc;
use mongodb::options::IndexOptions;
use mongodb::{Client, IndexModel};

pub fn routes(state: &AppState) -> Router<AppState> {
    let access_token_route = Router::new()
        .route("/", put(update_page_handler))
        .route_layer(from_fn_with_state(
            state.clone(),
            auth_guard::access_token_extractor,
        ));

    Router::new()
        .merge(access_token_route)
        .route("/:pageUuid", get(find_page_by_uuid_handler))
}

pub async fn create_pages_indexes(client: &Client, db_name: &str) {
    // Uuid unique index
    let uuid_options = IndexOptions::builder().unique(true).build();
    let uuid_index = IndexModel::builder()
        .keys(doc! {"uuid": 1})
        .options(uuid_options)
        .build();

    client
        .database(db_name)
        .collection::<Page>("pages")
        .create_index(uuid_index, None)
        .await
        .expect("error creating the page (uuid) index");
}
