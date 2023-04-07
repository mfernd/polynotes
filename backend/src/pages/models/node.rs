use crate::api_error::ApiError;
use axum::http::StatusCode;
use bson::Bson;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Node {
    #[serde(with = "bson::serde_helpers::uuid_1_as_binary")]
    pub uuid: Uuid,
    #[serde(rename = "type")]
    pub node_type: NodeType,
    pub data: String,
}

impl Node {
    pub fn vec_to_bson(nodes: Vec<Node>) -> Result<Bson, ApiError> {
        let bson_nodes = if !nodes.is_empty() {
            bson::to_bson(&nodes)
        } else {
            let mut nodes = nodes;
            nodes.push(Node {
                uuid: Uuid::new_v4(),
                node_type: NodeType::Text,
                data: String::default(),
            });
            bson::to_bson(&nodes)
        }
        .map_err(|_| ApiError::new(StatusCode::BAD_REQUEST, "Page nodes are malformed"))?;

        Ok(bson_nodes)
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "kebab-case")]
pub enum NodeType {
    Text,
    #[serde(rename = "header-1")]
    Header1,
    #[serde(rename = "header-2")]
    Header2,
    #[serde(rename = "header-3")]
    Header3,
    Image,
    Table,
    BulletedList,
    NumberedList,
    Column,
}
