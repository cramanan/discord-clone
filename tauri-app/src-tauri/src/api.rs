use crate::{constants, errors::AppError};
use futures::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use tauri::{
    async_runtime::JoinHandle, webview::Cookie, AppHandle, Emitter, Runtime, State, Url, Webview,
};
use tauri_plugin_http::reqwest;
use tokio::sync::{broadcast, Mutex};
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
    let base = Url::parse(constants::API_URL)?;
    let url = base.join(&endpoint)?;

    let jar = std::sync::Arc::new(reqwest::cookie::Jar::default());

    if let Ok(cookies) = webview.cookies() {
        for cookie in cookies {
            jar.add_cookie_str(&cookie.to_string(), &base);
        }
    }

    let client = reqwest::Client::builder()
        .cookie_provider(jar.clone())
        .build()?;

    let response = client
        .request(method.into(), url.clone())
        .json(&payload)
        .send()
        .await?;

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

#[derive(Debug)]
pub struct AppState {
    tx: broadcast::Sender<serde_json::Value>,
    write_task: Option<JoinHandle<()>>,
    read_task: Option<JoinHandle<()>>,
}

impl Default for AppState {
    fn default() -> Self {
        let (tx, _) = broadcast::channel(2048);
        Self {
            tx,
            write_task: None,
            read_task: None,
        }
    }
}

#[tauri::command]
pub async fn ws_send(
    state: State<'_, Mutex<AppState>>,
    value: serde_json::Value,
) -> Result<usize, AppError> {
    Ok(state.lock().await.tx.send(value)?)
}

#[tauri::command]
pub async fn websocket<R: Runtime>(
    state: State<'_, Mutex<AppState>>,
    app: AppHandle<R>,
    webview: Webview<R>,
) -> Result<String, AppError> {
    let (mut sink, mut stream) = {
        let mut request = constants::WS_URL.into_client_request()?;
        let cookies_str = webview
            .cookies()?
            .iter()
            .map(|cookie| format!("{}={}", cookie.name(), cookie.value()))
            .collect::<Vec<_>>()
            .join(";");
        request.headers_mut().append("Cookie", cookies_str.parse()?);
        let (ws_stream, _) = tokio_tungstenite::connect_async(request).await?;
        ws_stream.split()
    };

    let mut state = state.lock().await;

    // ---- Stop previous tasks ----
    if let Some(task) = state.read_task.take() {
        task.abort()
    }

    if let Some(task) = state.write_task.take() {
        task.abort()
    }

    // ---- Read Pump ----
    let event = "discord-clone://ws";
    state.read_task = Some(tauri::async_runtime::spawn(async move {
        while let Some(Ok(msg)) = stream.next().await {
            if let Ok(payload) = serde_json::from_slice::<serde_json::Value>(&msg.into_data()) {
                let _ = app.emit("discord-clone://ws", payload);
            }
        }
    }));

    // ---- Write Pump ----
    let mut rx = state.tx.subscribe();
    state.write_task = Some(tauri::async_runtime::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            if let Ok(bytes) = serde_json::to_vec(&msg) {
                let _ = sink.send(bytes.into()).await;
            }
        }
    }));

    Ok(event.into())
}
