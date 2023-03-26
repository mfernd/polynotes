use crate::users::User;
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
        let options = IndexOptions::builder().unique(true).build();
        let index = IndexModel::builder()
            .keys(doc! {"email": 1})
            .options(options)
            .build();

        client
            .database(DB_NAME)
            .collection::<User>("users")
            .create_index(index, None)
            .await
            .expect("error creating the user index");
    }
}
