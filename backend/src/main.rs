#[tokio::main]
async fn main() {
    load_env_file();
    polynotes_backend::create_server().await;
}

#[cfg(debug_assertions)]
fn load_env_file() {
    // Load file only in debug builds
    dotenvy::dotenv().expect(".env file not found");
}

#[cfg(not(debug_assertions))]
fn load_env_file() {
    // Do nothing in release builds
}
