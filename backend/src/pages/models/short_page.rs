use bson::{doc, Document};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ShortPage {
    #[serde(with = "bson::serde_helpers::uuid_1_as_binary")]
    pub uuid: Uuid,
    pub title: String,
    pub created_at: i64,
    pub updated_at: i64,
}

impl ShortPage {
    pub fn get_doc() -> Document {
        doc! {
            "_id": 0,
            "uuid": 1,
            "title": 1,
            "createdAt": 1,
            "updatedAt": 1,
        }
    }
}
