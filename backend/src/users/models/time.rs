use bson::{doc, Document};
use once_cell::sync::Lazy;
use regex::Regex;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, Clone, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Time {
    #[serde(
        default = "Uuid::new_v4",
        with = "bson::serde_helpers::uuid_1_as_binary"
    )]
    pub uuid: Uuid,
    #[validate(length(
        max = 32,
        message = "The project field needs to be under 32 characters"
    ))]
    pub project: String,
    #[validate(length(
        max = 280,
        message = "The description field needs to be under 280 characters"
    ))]
    pub description: String,
    pub starting_time: i64, // unix timestamp in seconds
    pub duration: i64,      // in seconds
}

static HASHTAG_REGEX: Lazy<Regex> = Lazy::new(|| Regex::new(r"#(\w+)").unwrap());

impl Time {
    /// Pipeline to get all times from a user, can filter with its uuid
    pub fn get_all_times_pipeline(user_uuid: Uuid, time_uuid: Option<Uuid>) -> Vec<Document> {
        let mut pipeline = vec![
            doc! { "$match": { "uuid": user_uuid } },
            doc! { "$unwind": "$timeTracker.times" },
            doc! {
                "$project": {
                    "_id": 0,
                    "uuid": "$timeTracker.times.uuid",
                    "project": "$timeTracker.times.project",
                    "description": "$timeTracker.times.description",
                    "startingTime": "$timeTracker.times.startingTime",
                    "duration": "$timeTracker.times.duration",
                },
            },
        ];

        if let Some(uuid) = time_uuid {
            pipeline.push(doc! { "$match": { "uuid": uuid } });
        }

        pipeline
    }

    pub fn extract_tags(text: &str) -> Vec<String> {
        HASHTAG_REGEX
            .captures_iter(text)
            .filter_map(|m| m.get(1))
            .map(|m| m.as_str().to_owned())
            .collect()
    }
}
