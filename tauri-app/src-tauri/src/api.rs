use serde::{Deserialize, Deserializer, Serialize, Serializer};
use std::{str::FromStr, sync::Arc};
use tauri::{webview::Cookie, Url};
use tauri_plugin_http::reqwest;

use crate::{constants, errors::AppError};

#[derive(Debug)]
pub struct Method(pub tauri::http::Method);

impl<'de> Deserialize<'de> for Method {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        // Deserialize string
        let s = String::deserialize(deserializer)?;

        // Parse into Method
        tauri::http::Method::from_str(&s)
            .map(Method)
            .map_err(serde::de::Error::custom)
    }
}

impl Serialize for Method {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        // Serialize the inner HTTP method as a string
        serializer.serialize_str(self.0.as_str())
    }
}

#[tauri::command]
pub async fn api<R: tauri::Runtime>(
    webview: tauri::Webview<R>,
    endpoint: String,
    method: Method,
    payload: Option<serde_json::Value>,
) -> Result<serde_json::Value, AppError> {
    let base = Url::parse(constants::API_URL).map_err(AppError::from)?;
    println!("{:?}", base.domain());
    let url = base.join(&endpoint).map_err(AppError::from)?;

    let jar = Arc::new(reqwest::cookie::Jar::default());

    if let Ok(cookies) = webview.cookies() {
        for cookie in cookies {
            jar.add_cookie_str(&cookie.to_string(), &base);
        }
    }

    let client = reqwest::Client::builder()
        .cookie_provider(jar.clone())
        .build()
        .map_err(AppError::from)?;

    let response = client
        .request(method.0, url.clone())
        .json(&payload)
        .send()
        .await
        .map_err(AppError::from)?;

    for cookie in response.cookies() {
        let webview_cookie = Cookie::build((cookie.name(), cookie.value()))
            .path("/")
            // .domain("localhost")
            .permanent()
            .secure(false)
            .http_only(true)
            // .same_site(tauri::webview::cookie::SameSite::Lax)
            .build();

        // Maybe propagate error ?
        _ = webview.set_cookie(webview_cookie);
    }

    response.json().await.map_err(AppError::from)
}
