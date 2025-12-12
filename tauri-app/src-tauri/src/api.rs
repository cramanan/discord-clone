use std::{str::FromStr, sync::Arc};

use futures::{SinkExt, StreamExt};
use serde::{Deserialize, Deserializer, Serialize, Serializer};
use tauri::{
    async_runtime::{channel, Mutex, Receiver, Sender},
    http,
    webview::Cookie,
    AppHandle, Emitter, Manager, Runtime, State, Url, Webview,
};
use tauri_plugin_http::reqwest;
use tokio_tungstenite::tungstenite::{client::IntoClientRequest, Message};

use crate::{constants, errors::AppError};

#[derive(Debug)]
pub struct Method(pub http::Method);

impl<'de> Deserialize<'de> for Method {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        // Deserialize string
        let s = String::deserialize(deserializer)?;

        // Parse into Method
        http::Method::from_str(&s)
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
            // .same_site(webview::cookie::SameSite::Lax)
            .build();

        // Maybe propagate error ?
        _ = webview.set_cookie(webview_cookie);
    }

    response.json().await.map_err(AppError::from)
}

#[derive(Debug, Clone)]
pub struct AppState {
    tx: Arc<Mutex<Sender<serde_json::Value>>>,
    rx: Arc<Mutex<Receiver<serde_json::Value>>>,
}

impl Default for AppState {
    fn default() -> Self {
        let (tx, rx) = channel(2048);
        Self {
            tx: Arc::new(Mutex::new(tx)),
            rx: Arc::new(Mutex::new(rx)),
        }
    }
}

#[tauri::command]
pub async fn ws_send(
    state: State<'_, AppState>,
    message: serde_json::Value,
) -> Result<(), AppError> {
    Ok(state.tx.lock().await.send(message).await?)
}

#[tauri::command]
pub async fn websocket<R: Runtime>(
    state: State<'_, AppState>,
    app: AppHandle<R>,
    webview: Webview<R>,
) -> Result<(), AppError> {
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

    // Read Pump
    tauri::async_runtime::spawn({
        async move {
            while let Some(message_result) = stream.next().await {
                match message_result {
                    Ok(message) => {
                        if let Ok(payload) =
                            serde_json::from_slice::<serde_json::Value>(&message.into_data())
                        {
                            println!("received: {}", payload);
                            if let Err(error) = app.app_handle().emit("discord-clone://ws", payload)
                            {
                                eprintln!("error: {}", error)
                            }
                        }
                    }
                    Err(e) => eprintln!("WebSocket read error: {}", e),
                }
            }
        }
    });

    // ---- Write Pump ----
    let rx = state.rx.clone(); // or better: store receiver outside mutex

    tauri::async_runtime::spawn(async move {
        let mut rx = rx.lock().await;
        while let Some(msg) = rx.recv().await {
            println!("sending: {:?}", msg);

            if let Err(e) = sink.send(Message::Text(msg.to_string().into())).await {
                eprintln!("write error: {e}");
                break; // IMPORTANT
            }
        }
    });

    Ok(())
}
