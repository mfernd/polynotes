use crate::api_error::ApiError;
use crate::users::models::time::Time;
use crate::users::models::user::User;
use crate::AppState;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::{Extension, Json};
use axum_extra::extract::WithRejection;
use bson::{doc, Document};
use chrono::{NaiveDate, NaiveDateTime, NaiveTime};
use futures::TryStreamExt;
use uuid::Uuid;

pub async fn find_times_by_date_handler(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
    WithRejection(Path((user_uuid, date_from, date_to)), _): WithRejection<
        Path<(Uuid, String, String)>,
        ApiError,
    >,
) -> Result<Json<Vec<Time>>, ApiError> {
    user.check_permissions(user_uuid)?;

    let date_start = parse_date_from_str(&date_from, false)?;
    let date_end = parse_date_from_str(&date_to, true)?;

    let mut pipeline = Time::get_all_times_pipeline(user_uuid, None);
    pipeline.append(&mut vec![
        // add seconds to a UNIX timestamps in seconds
        doc! { "$addFields": { "endTime": { "$add": ["$startingTime", "$duration"] } } },
        doc! {
            "$match": { // filter by contained+overlapped dates
                "$and": [
                    { "startingTime": { "$lte": date_end.timestamp() } },
                    { "endTime": { "$gte": date_start.timestamp() } },
                ],
            },
        },
    ]);

    let times = state
        .database
        .get_collection::<User>("users")
        .aggregate(pipeline, None)
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not get the time due to a problem in the server",
            )
        })?
        .try_collect::<Vec<Document>>()
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not get the time due to a problem in the server",
            )
        })?
        .into_iter()
        .filter_map(|doc| bson::from_document::<Time>(doc).ok())
        .collect::<Vec<Time>>();

    Ok(Json(times))
}

fn parse_date_from_str(date: &str, at_day_end: bool) -> Result<NaiveDateTime, ApiError> {
    let naive_date = NaiveDate::parse_from_str(date, "%Y-%m-%d").map_err(|_| {
        ApiError::new(
            StatusCode::BAD_REQUEST,
            "Invalid date, needs to be in the format of: 2001-07-08",
        )
    })?;

    if at_day_end {
        let end_of_day = NaiveTime::from_hms_opt(23, 59, 59).unwrap_or(NaiveTime::default());
        return Ok(naive_date.and_time(end_of_day));
    }

    Ok(naive_date.and_time(NaiveTime::default()))
}
