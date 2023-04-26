use crate::api_error::ApiError;
use crate::users::models::user::User;
use crate::AppState;
use axum::extract::{Path, State};
use axum::{Extension, Json};
use axum_extra::extract::WithRejection;
use serde_json::{json, Value};
use uuid::Uuid;

pub async fn find_times_by_date_handler(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
    WithRejection(Path((user_uuid, date_from, date_to)), _): WithRejection<
        Path<(Uuid, String, String)>,
        ApiError,
    >,
) -> Result<Json<Value>, ApiError> {
    user.check_permissions(user_uuid)?;

    Ok(Json(json!("ok")))
}
