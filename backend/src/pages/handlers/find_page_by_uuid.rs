use crate::api_error::ApiError;
use crate::pages::models::abstracted_page::AbstractedPage;
use crate::AppState;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::Json;
use axum_extra::extract::WithRejection;
use bson::{doc, Document};
use futures::StreamExt;
use uuid::Uuid;

pub async fn find_page_by_uuid_handler(
    State(state): State<AppState>,
    WithRejection(Path(page_uuid), _): WithRejection<Path<Uuid>, ApiError>,
) -> Result<Json<AbstractedPage>, ApiError> {
    let bson_uuid = bson::Uuid::from_uuid_1(page_uuid);

    let pipeline: Vec<Document> = vec![
        doc! { "$match": { "uuid": bson_uuid } },
        doc! { "$limit": 1 },
        doc! {
            "$lookup": {
                "from": "users",
                "localField": "author",
                "foreignField": "_id",
                "as": "author",
            }
        },
        doc! { "$unwind": "$author" },
        doc! { "$project": AbstractedPage::get_doc() },
    ];

    let page = state
        .database
        .get_collection::<AbstractedPage>("pages")
        .aggregate(pipeline, None)
        .await
        .map_err(|_| {
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not get the page due to a problem in the server",
            )
        })?
        .next()
        .await
        .ok_or(ApiError::new(StatusCode::NOT_FOUND, "Page not found"))?
        .map(bson::from_document::<AbstractedPage>)
        .map_err(|e| {
            println!("error1: {e:?}");
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not deserialize the page due to a problem in the server",
            )
        })?
        .map_err(|e| {
            println!("error2: {e:?}");
            ApiError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not deserialize the page due to a problem in the server",
            )
        })?;

    Ok(Json(page))
}
