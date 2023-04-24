use crate::users::models::abstracted_user::AbstractedUser;
use crate::users::models::time_tracker::TimeTracker;
use crate::users::models::user_role::UserRole;
use bson::oid::ObjectId;
use rand::distributions::Alphanumeric;
use rand::{thread_rng, Rng};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct User {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    #[serde(with = "bson::serde_helpers::uuid_1_as_binary")]
    pub uuid: Uuid,
    pub username: String,
    pub email: String,
    pub password: String,
    pub role: UserRole,
    pub is_verified: bool,
    pub nonce: Option<String>,
    pub time_tracker: TimeTracker,
}

impl User {
    pub fn new(username: String, email: String, password: String) -> Self {
        let nonce: String = thread_rng()
            .sample_iter(&Alphanumeric)
            .take(42)
            .map(char::from)
            .collect();

        User {
            id: None,
            uuid: Uuid::new_v4(),
            username,
            email,
            password,
            role: UserRole::User,
            is_verified: false,
            nonce: Some(nonce),
            time_tracker: TimeTracker::new(),
        }
    }

    pub fn get_abstracted(&self) -> AbstractedUser {
        AbstractedUser {
            uuid: self.uuid.to_owned(),
            username: self.username.to_owned(),
            email: self.email.to_owned(),
            role: self.role,
        }
    }

    pub fn check_is_verified(&self) -> bool {
        self.is_verified && self.nonce.is_none()
    }

    pub fn is_admin(&self) -> bool {
        self.role.eq(&UserRole::Admin)
    }
}
