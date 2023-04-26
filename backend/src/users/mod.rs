mod handlers;
pub mod models;

use crate::middlewares::auth_guard;
use crate::users::handlers::find_all_projects_tags::find_all_tags_handler;
use crate::users::handlers::find_time_by_uuid::find_time_by_uuid_handler;
use crate::users::handlers::{
    find_all_projects_tags::find_all_projects_handler,
    find_recent_pages::find_recent_pages_handler, find_times_by_date::find_times_by_date_handler,
    find_user_by_email::find_user_by_email_handler, find_user_by_uuid::find_user_by_uuid_handler,
    find_user_pages::find_user_pages_handler, insert_or_update_time::insert_or_update_time_handler,
};
use crate::users::models::user::User;
use crate::AppState;
use axum::middleware::from_fn_with_state;
use axum::routing::{get, put};
use axum::Router;
use bson::doc;
use mongodb::options::IndexOptions;
use mongodb::{Client, IndexModel};

pub fn routes(state: &AppState) -> Router<AppState> {
    let users_routes = Router::new()
        // .route("/", get(find_all_users_handler))
        .route("/uuid/:user_uuid", get(find_user_by_uuid_handler))
        .route("/email/:user_email", get(find_user_by_email_handler));

    let pages_routes = Router::new()
        .route("/me/pages", get(find_user_pages_handler))
        .route("/me/pages/recent", get(find_recent_pages_handler));

    let time_tracker_routes = Router::new()
        .route(
            "/:user_uuid/times/search/:date_from/to/:date_to",
            get(find_times_by_date_handler),
        )
        .route(
            "/:user_uuid/times/:time_uuid",
            get(find_time_by_uuid_handler),
        )
        .route("/:user_uuid/times", put(insert_or_update_time_handler))
        .route("/:user_uuid/projects", get(find_all_projects_handler))
        .route("/:user_uuid/tags", get(find_all_tags_handler));

    Router::new()
        .merge(users_routes)
        .merge(pages_routes)
        .merge(time_tracker_routes)
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

    // Time tracker time unique index
    let email_options = IndexOptions::builder().unique(true).build();
    let email_index = IndexModel::builder()
        .keys(doc! {"timeTracker.times.uuid": 1})
        .options(email_options)
        .build();

    client
        .database(db_name)
        .collection::<User>("users")
        .create_index(email_index, None)
        .await
        .expect("error creating the timeTracker.times (uuid) index");
}
