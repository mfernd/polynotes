use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Time {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    #[serde(with = "bson::serde_helpers::uuid_1_as_binary")]
    pub uuid: Uuid,
    pub project: Option<String>,
    pub description: Option<String>,
    pub tags: Vec<String>,  // extracted from the description
    pub starting_time: i64, // timestamp in seconds
    pub duration: i64,      // in minutes
}
