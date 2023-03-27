use crate::users::models::user::User;
use bson::doc;
use dotenvy::var;
use mongodb::options::IndexOptions;
use mongodb::{options::ClientOptions, Client, Collection, IndexModel};

#[derive(Debug, Clone)]
pub struct MongoDatabase {
    client: Client,
}

static DB_NAME: &str = "polynotes-db";

impl MongoDatabase {
    pub async fn new() -> Self {
        let mongo_uri = var("MONGO_URI").expect("MONGO_URI must be provided in the .env file");

        let client_options = ClientOptions::parse(mongo_uri.as_str())
            .await
            .expect("Error parsing the MONGO_URI");

        let error_message = format!(
            "Couldn't connect to Mongo cluster using: \"{}\"",
            mongo_uri.as_str(),
        );

        let client = Client::with_options(client_options).expect(&error_message);
        MongoDatabase::create_indexes(&client).await;

        // ping database
        // let ping_status = client
        //     .database("admin")
        //     .run_command(doc! {"ping": 1}, None)
        //     .await;
        // println!(">>> DB connection status: {:?}", ping_status);

        MongoDatabase { client }
    }

    pub fn get_collection<T>(&self, collection_name: &str) -> Collection<T> {
        self.client
            .database(DB_NAME)
            .collection::<T>(collection_name)
    }

    async fn create_indexes(client: &Client) {
        // Uuid unique index
        let uuid_options = IndexOptions::builder().unique(true).build();
        let uuid_index = IndexModel::builder()
            .keys(doc! {"uuid": 1})
            .options(uuid_options)
            .build();

        client
            .database(DB_NAME)
            .collection::<User>("users")
            .create_index(uuid_index, None)
            .await
            .expect("error creating the user (uuid) index");

        // Email unique index
        let email_options = IndexOptions::builder().unique(true).build();
        let email_index = IndexModel::builder()
            .keys(doc! {"email": 1})
            .options(email_options)
            .build();

        client
            .database(DB_NAME)
            .collection::<User>("users")
            .create_index(email_index, None)
            .await
            .expect("error creating the user (email) index");
    }
}
