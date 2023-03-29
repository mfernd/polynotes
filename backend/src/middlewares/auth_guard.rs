use crate::auth::error::AuthError;
use crate::auth::error::AuthError::InternalError;
use crate::auth::jwt::claims::{ClaimType, Claims};
use crate::users::models::user::User;
use crate::AppState;
use axum::extract::State;
use axum::http::header::COOKIE;
use axum::http::{HeaderMap, Request};
use axum::middleware::Next;
use axum::response::Response;
use bson::doc;
use tower_cookies::Cookie;

pub async fn is_logged<T>(
    State(state): State<AppState>,
    headers: HeaderMap,
    mut request: Request<T>,
    next: Next<T>,
) -> Result<Response, AuthError> {
    // Extract cookies from headers (not with tower_cookies layer)
    let extracted_cookies = headers
        .get(COOKIE)
        .ok_or(AuthError::NotLogged)?
        .to_str()
        .map_err(|_| AuthError::NotLogged)?
        .to_owned();

    // Get sub uuid from access_token in cookies
    let sub_uuid = Cookie::split_parse_encoded(extracted_cookies)
        .filter_map(|cookie| cookie.ok())
        .find(|cookie| "access_token" == cookie.name())
        .map(|access_cookie| {
            Claims::decode(access_cookie.value().to_owned(), ClaimType::AccessToken)
        })
        .ok_or(AuthError::NotLogged)?
        .map(|token| token.claims.sub)
        .map_err(|_| AuthError::NotLogged)?
        .ok_or(AuthError::NotLogged)?;

    // Find user with uuid inside the jwt
    let bson_uuid = bson::Uuid::parse_str(sub_uuid).map_err(|_| AuthError::NotLogged)?;
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
