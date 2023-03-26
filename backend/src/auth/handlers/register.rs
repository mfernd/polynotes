use crate::auth::hash_utils;
use crate::auth::{jwt::claims::ClaimType, jwt::claims::Claims, AuthError};
use crate::users::{AbstractedUser, User};
use crate::AppState;
use axum::extract::State;
use axum::{http::StatusCode, Json};
use axum_extra::extract::WithRejection;
use mongodb::error::{ErrorKind, WriteFailure};
use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
pub struct RegisterRequest {
    #[validate(length(min = 3))]
    pub username: String,
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 8))]
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct RegisterResponse {
    pub message: String,
}

pub async fn register_handler(
    State(state): State<AppState>,
    WithRejection(Json(payload), _): WithRejection<Json<RegisterRequest>, AuthError>,
) -> Result<(StatusCode, Json<RegisterResponse>), AuthError> {
    payload.validate().map_err(|_| AuthError::InvalidFields)?;

    let hashed_password = hash_utils::hash(payload.password)?;
    let new_user = User::new(payload.username, payload.email, hashed_password);

    // Save user
    state
        .database
        .get_collection::<User>("users")
        .insert_one(&new_user, None)
        .await
        .map_err(|err| match *err.kind {
            ErrorKind::Write(WriteFailure::WriteError(error)) if error.code == 11000 => {
                AuthError::UserConflict
            }
            _ => AuthError::CouldNotCreateAccount,
        })?;

    // Send verification link
    let link = format!(
        "http://localhost:3000/api/v1/auth/verify-email?user={}&nonce={}",
        new_user.uuid,
        new_user.nonce.unwrap(),
    );
    let _ = state
        .mailer
        .send_mail(
            format!("{} <{}>", new_user.username, new_user.email),
            "Bienvenue sur Polynotes !".to_owned(),
            format!(
                "<h1>Bienvenue {} sur Polynotes ! 🎉️<h1>\
                <p>Cliquez sur ce <a href=\"{link}\" target=\"_blank\">lien</a> pour vérifier ce compte.</p>\
                <p><small>\
                    Si vous n'êtes pas à l'origine de cette demande, \
                    aucune action supplémentaire de votre part n'est requise. \
                    Ignorez simplement ce message.\
                </small></p>",
                new_user.username,
            ),
        )
        .await;

    Ok((
        StatusCode::CREATED,
        Json(RegisterResponse {
            message: "Verification email sent".to_owned(),
        }),
    ))
}
