use crate::pages::models::node::Node;
use crate::users::models::abstracted_user::AbstractedUser;
use bson::{doc, Document};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AbstractedPage {
    #[serde(with = "bson::serde_helpers::uuid_1_as_binary")]
    pub uuid: Uuid,
    pub author: AbstractedUser,
    pub title: String,
    pub nodes: Vec<Node>,
    pub created_at: i64,
    pub updated_at: i64,
}

impl AbstractedPage {
    pub fn get_doc() -> Document {
        doc! {
            "_id": 0,
            "uuid": 1,
            "author.uuid": 1,
            "author.username": 1,
            "author.email": 1,
            "author.role": 1,
            "title": 1,
            "nodes": 1,
            "createdAt": 1,
            "updatedAt": 1,
        }
    }
}
