use crate::users::models::time::Time;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TimeTracker {
    pub times: Vec<Time>,
    pub projects: Vec<String>,
    pub tags: Vec<String>,
}

impl TimeTracker {
    pub fn new() -> Self {
        Self {
            times: Vec::new(),
            projects: Vec::new(),
            tags: Vec::new(),
        }
    }
}
