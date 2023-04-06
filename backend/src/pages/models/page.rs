use crate::pages::models::node::Node;
use crate::users::models::user::{AbstractedUser, User};
use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Page {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    #[serde(with = "bson::serde_helpers::uuid_1_as_binary")]
    pub uuid: Uuid,
    pub author: ObjectId,
    pub title: String,
    pub nodes: Vec<Node>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AbstractedPage {
    #[serde(with = "bson::serde_helpers::uuid_1_as_binary")]
    pub uuid: Uuid,
    pub author: AbstractedUser,
    pub title: String,
    pub nodes: Vec<Node>,
}

impl Page {
    pub fn new(uuid: Option<Uuid>, user: User, title: String, nodes: Vec<Node>) -> Self {
        let page_uuid = match uuid {
            None => Uuid::new_v4(),
            Some(page_uuid) => page_uuid,
        };

        let user_id = user.id.unwrap();

        Self {
            id: None,
            author: user_id,
            uuid: page_uuid,
            title,
            nodes,
        }
    }
}
