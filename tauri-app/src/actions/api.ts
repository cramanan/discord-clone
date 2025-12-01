import { invoke } from "@tauri-apps/api/core";

type Method = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

export async function api<R, P = unknown>(
  endpoint: string,
  method: Method,
  payload?: P
) {
  return await invoke<R>("api", { endpoint, method, payload });
}
