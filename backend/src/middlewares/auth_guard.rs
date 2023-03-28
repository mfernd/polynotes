use crate::auth::error::AuthError;
use crate::auth::error::AuthError::InternalError;
use crate::auth::jwt::claims::{ClaimType, Claims};
use crate::users::models::user::User;
use crate::AppState;
use axum::extract::State;
use axum::http::{HeaderMap, Request};
use axum::middleware::Next;
use axum::response::Response;
use bson::doc;
use tower_cookies::Cookie;
use validator::HasLen;

pub async fn is_logged<T>(
    State(state): State<AppState>,
    headers: HeaderMap,
    mut request: Request<T>,
    next: Next<T>,
) -> Result<Response, AuthError> {
    // Extract cookies from headers
    let header_cookies = headers
        .get("cookie")
        .ok_or(AuthError::NotLogged)?
        .to_str()
        .map_err(|_| AuthError::NotLogged)?
        .to_owned();

    // Parse token cookies to Claims
    let claims = Cookie::split_parse_encoded(header_cookies)
        .filter_map(|cookie| cookie.ok())
        .filter_map(|cookie| {
            let (key, value) = cookie.name_value();
            match key {
                "access_token" => Claims::decode(value.to_owned(), ClaimType::AccessToken).ok(),
                "refresh_token" => Claims::decode(value.to_owned(), ClaimType::RefreshToken).ok(),
                _ => None,
            }
        })
        .map(|token| token.claims)
        .collect::<Vec<Claims>>();

    // Check if there is "access_token" + "refresh_token"
    if claims.length() < 2 {
        return Err(AuthError::NotLogged);
    }

    println!("{claims:?}\n");

    // Find user with uuid inside the jwt
    // TODO: use the uuid inside the claims
    let bson_uuid = bson::Uuid::parse_str("7b052c99-0ee7-4889-99b4-38b340547ae5")
        .map_err(|_| AuthError::NotLogged)?;
    let user = state
        .database
        .get_collection::<User>("users")
        .find_one(doc! {"uuid": bson_uuid}, None)
        .await
        .map_err(|_| InternalError)?
        .ok_or(AuthError::UserNotFound)?;

    // Add user to request for next routes
    request.extensions_mut().insert(user);

    Ok(next.run(request).await)
}
