use dotenvy::var;
use mongodb::{options::ClientOptions, Client, Collection};
use once_cell::sync::OnceCell;
use std::borrow::ToOwned;

static MONGO_INSTANCE: OnceCell<Mongo> = OnceCell::new();

#[derive(Debug, Clone)]
pub struct Mongo {
    client: Client,
}

const DB_NAME: &str = "polynotes-db";

impl Mongo {
    pub async fn set_global_instance() {
        MONGO_INSTANCE
            .set(Mongo::connect().await)
            .expect("Error setting the global mongo instance")
    }

    async fn connect() -> Self {
        let mongo_uri = var("MONGO_URI").expect("MONGO_URI must be provided in the .env file");

        let client_options = ClientOptions::parse(mongo_uri.as_str())
            .await
            .expect("Error parsing the MONGO_URI");

        let error_message = format!(
            "Couldn't connect to Mongo cluster using: \"{}\"",
            mongo_uri.as_str(),
        );

        let client = Client::with_options(client_options).expect(&error_message);

        Mongo { client }
    }

    /// See ["Parallelism"](https://mongodb.github.io/mongo-rust-driver/manual/performance.html#parallelism)
    /// in the official MongoDB Rust Driver documentation
    pub fn get_client() -> Client {
        MONGO_INSTANCE
            .get()
            .expect("Mongo client instance is not initialized")
            .clone()
            .client
    }

    pub fn get_collection<T>(collection_name: &str) -> Collection<T> {
        Self::get_client()
            .database(DB_NAME)
            .collection::<T>(collection_name)
    }
}
