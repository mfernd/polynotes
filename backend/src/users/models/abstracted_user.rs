use crate::users::models::user_role::UserRole;
use bson::{doc, Document};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AbstractedUser {
    #[serde(with = "bson::serde_helpers::uuid_1_as_binary")]
    pub uuid: Uuid,
    pub username: String,
    pub email: String,
    pub role: UserRole,
}

impl AbstractedUser {
    pub fn get_doc() -> Document {
        doc! {
            "_id": 0,
            "uuid": 1,
            "username": 1,
            "email": 1,
            "role": 1,
        }
    }
}
