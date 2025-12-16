use crate::{constants, errors::AppError};
use futures::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use tauri::{webview::Cookie, AppHandle, Emitter, Runtime, State, Url, Webview};
use tauri_plugin_http::reqwest;
use tokio::sync::broadcast;
use tokio_tungstenite::tungstenite::client::IntoClientRequest;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum Method {
    GET,
    POST,
    PUT,
    DELETE,
    PATCH,
    OPTIONS,
}

impl From<Method> for tauri::http::Method {
    fn from(value: Method) -> Self {
        use tauri::http::Method as HttpMethod;
        match value {
            Method::GET => HttpMethod::GET,
            Method::POST => HttpMethod::POST,
            Method::PUT => HttpMethod::PUT,
            Method::DELETE => HttpMethod::DELETE,
            Method::PATCH => HttpMethod::PATCH,
            Method::OPTIONS => HttpMethod::OPTIONS,
        }
    }
}

#[tauri::command]
pub async fn api<R: Runtime>(
    webview: Webview<R>,
    endpoint: String,
    method: Method,
    payload: Option<serde_json::Value>,
) -> Result<serde_json::Value, AppError> {
    let base = Url::parse(constants::API_URL).map_err(AppError::from)?;
    let url = base.join(&endpoint).map_err(AppError::from)?;

    let jar = std::sync::Arc::new(reqwest::cookie::Jar::default());

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
        .request(method.into(), url.clone())
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
            // .same_site(webview::cookie::SameSite::Lax)
            .build();

        // Maybe propagate error ?
        _ = webview.set_cookie(webview_cookie);
    }

    response.json().await.map_err(AppError::from)
}

#[derive(Debug, Clone)]
pub struct AppState {
    tx: broadcast::Sender<serde_json::Value>,
}

impl Default for AppState {
    fn default() -> Self {
        let (tx, _) = broadcast::channel(2048);
        Self { tx }
    }
}

#[tauri::command]
pub async fn ws_send(
    state: State<'_, AppState>,
    value: serde_json::Value,
) -> Result<usize, AppError> {
    Ok(state.tx.send(value)?)
}

#[tauri::command]
pub async fn websocket<R: Runtime>(
    state: State<'_, AppState>,
    app: AppHandle<R>,
    webview: Webview<R>,
) -> Result<String, AppError> {
    let mut request = constants::WS_URL.into_client_request()?;
    let cookies_str = webview
        .cookies()?
        .iter()
        .map(|cookie| format!("{}={}", cookie.name(), cookie.value()))
        .collect::<Vec<_>>()
        .join(";");

    request.headers_mut().append("Cookie", cookies_str.parse()?);

    let (ws_stream, _) = tokio_tungstenite::connect_async(request).await?;
    let (mut sink, mut stream) = ws_stream.split();
    println!("{}", state.tx.receiver_count());
    let mut rx = state.tx.subscribe();
    let event = "discord-clone://ws";

    // ---- Read Pump ----
    tauri::async_runtime::spawn({
        async move {
            while let Some(message_result) = stream.next().await {
                let message = match message_result {
                    Ok(message) => message.into_data(),
                    _ => continue,
                };
                let _ = match serde_json::from_slice::<serde_json::Value>(&message) {
                    Ok(payload) => app.emit(event, payload),
                    _ => continue,
                };
            }
        }
    });

    // ---- Write Pump ----
    tauri::async_runtime::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            let bytes = match serde_json::to_vec(&msg) {
                Ok(b) => b,
                Err(e) => {
                    eprintln!("serialize error: {e}");
                    continue;
                }
            };

            println!("sending: {:?}", bytes);
            if let Err(e) = sink.send(bytes.into()).await {
                eprintln!("send error: {e}");
            };
        }
    });

    Ok(event.into())
}
