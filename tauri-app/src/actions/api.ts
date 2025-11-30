import { invoke } from "@tauri-apps/api/core";

type Method = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

export async function api<T, R>(endpoint: string, method: Method, payload?: T) {
  return await invoke<R>("api", { endpoint, method, payload });
}
