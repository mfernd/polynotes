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
