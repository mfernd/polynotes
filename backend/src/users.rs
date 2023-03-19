use axum::Router;
use bson::oid::ObjectId;
use rand::{distributions::Alphanumeric, thread_rng, Rng};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

pub fn routes() -> Router {
    Router::new()
}

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    id: Option<ObjectId>,
    #[serde(with = "bson::serde_helpers::uuid_1_as_binary")]
    pub uuid: Uuid,
    pub username: String,
    pub email: String,
    pub password: String,
    pub role: UserRole,
    pub is_verified: bool,
    pub nonce: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AbstractedUser {
    pub username: String,
    pub email: String,
    pub role: UserRole,
}

#[derive(Debug, Serialize, Deserialize, Copy, Clone)]
pub enum UserRole {
    Admin,
    User,
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
        }
    }

    pub fn get_abstracted(&self) -> AbstractedUser {
        AbstractedUser {
            username: self.username.to_owned(),
            email: self.email.to_owned(),
            role: self.role,
        }
    }

    pub fn is_verified(&self) -> bool {
        return self.is_verified && self.nonce == None;
    }

    pub fn verify_email(&mut self, email: String, nonce: String) -> Result<(), String> {
        if self.is_verified() {
            return Err("Already verified".to_owned());
        }

        if self.email != email || self.nonce != Some(nonce) {
            return Err("Invalid verified email or nonce".to_owned());
        }

        self.is_verified = true;
        self.nonce = None;

        Ok(())
    }
}
