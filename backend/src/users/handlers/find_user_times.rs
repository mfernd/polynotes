use crate::users::models::user::User;
use crate::AppState;
use axum::extract::{Path, State};
use axum::Extension;

pub async fn find_user_times_handler(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
    Path((user_uuid, date_from, date_to)): Path<(String, String, String)>,
) {
    todo!()
}
