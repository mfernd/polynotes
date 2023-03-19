use dotenvy::var;
use mongodb::{options::ClientOptions, Client};

/// Panic if it can't connect to the Mongo database
pub async fn connect() -> Client {
    let mongo_uri = var("MONGO_URI").expect("MONGO_URI must be provided in the .env file");

    let client_options = ClientOptions::parse(mongo_uri.as_str())
        .await
        .expect("Error parsing the MONGO_URI");

    let error_message = format!(
        "Couldn't connect to Mongo cluster using: \"{}\"",
        mongo_uri.as_str(),
    );

    Client::with_options(client_options).expect(&error_message)
}
