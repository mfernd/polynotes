use crate::api_error::ApiError;
use crate::auth::jwt::claims::{ClaimType, Claims};
use crate::users::models::user::User;
use crate::AppState;
use axum::extract::State;
use axum::http::header::COOKIE;
use axum::http::{HeaderMap, Request, StatusCode};
use axum::middleware::Next;
use axum::response::Response;
use bson::doc;
use tower_cookies::Cookie;

pub async fn access_token_extractor<T>(
    State(state): State<AppState>,
    headers: HeaderMap,
    mut request: Request<T>,
    next: Next<T>,
) -> Result<Response, ApiError> {
    let extracted_cookies = extract_cookie_from_headers(&headers)?;

    // Get sub uuid from access_token in cookies
    let sub_uuid = get_uuid_from_token_in_cookies(extracted_cookies, ClaimType::AccessToken)?;

    // Find user with uuid inside the jwt
    let user = find_user_by_uuid(&state, sub_uuid.to_owned()).await?;

    // Add user to request for next routes
    request.extensions_mut().insert(user);

    Ok(next.run(request).await)
}

pub async fn refresh_token_extractor<T>(
    State(state): State<AppState>,
    headers: HeaderMap,
    mut request: Request<T>,
    next: Next<T>,
) -> Result<Response, ApiError> {
    let extracted_cookies = extract_cookie_from_headers(&headers)?;

    // Get sub uuid from refresh_token in cookies
    let sub_uuid = get_uuid_from_token_in_cookies(extracted_cookies, ClaimType::RefreshToken)?;

    // Find user with uuid inside the jwt
    let user = find_user_by_uuid(&state, sub_uuid.to_owned()).await?;

    // Add user to request for next routes
    request.extensions_mut().insert(user);

    Ok(next.run(request).await)
}

/// Extract cookies from headers (not with tower_cookies layer)
fn extract_cookie_from_headers(headers: &HeaderMap) -> Result<String, ApiError> {
    let extracted_cookies = headers
        .get(COOKIE)
        .ok_or(ApiError::new(
            StatusCode::UNAUTHORIZED,
            "No credentials provided for an authenticated route",
        ))?
        .to_str()
        .map_err(|_| {
            ApiError::new(
                StatusCode::UNAUTHORIZED,
                "Invalid credentials in your header",
            )
        })?
        .to_owned();

    Ok(extracted_cookies)
}

/// Convert cookie to token by claim_type
fn get_uuid_from_token_in_cookies(
    cookies: String,
    claim_type: ClaimType,
) -> Result<String, ApiError> {
    let token_name = match claim_type {
        ClaimType::AccessToken => "access_token",
        ClaimType::RefreshToken => "refresh_token",
    };

    let sub_uuid = Cookie::split_parse_encoded(cookies)
        .filter_map(|cookie| cookie.ok())
        .find(|cookie| token_name == cookie.name())
        .map(|access_cookie| Claims::decode(access_cookie.value().to_owned(), claim_type))
        .ok_or(ApiError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            "Could not decode jwt token",
        ))?
        .map(|token| token.claims.sub)?
        .ok_or(ApiError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            "No \"sub\" key in jwt token",
        ))?;

    Ok(sub_uuid)
}

/// Find user with uuid inside the jwt
async fn find_user_by_uuid(state: &AppState, uuid: String) -> Result<User, ApiError> {
    let bson_uuid = bson::Uuid::parse_str(uuid)
        .map_err(|_| ApiError::new(StatusCode::BAD_REQUEST, "Invalid \"uuid\" in jwt token"))?;

    let user = state
        .database
        .get_collection::<User>("users")
        .find_one(doc! {"uuid": bson_uuid}, None)
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Error with the server, could not fetch the user",
            )
        })?
        .ok_or(ApiError::new(StatusCode::NOT_FOUND, "User not found"))?;

    Ok(user)
}
