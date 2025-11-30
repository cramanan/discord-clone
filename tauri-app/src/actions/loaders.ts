import { redirect } from "@tanstack/solid-router";
import { User } from "~/types";
import { UserSchema } from "~/types/schemas";
import { api } from "./api";

export async function authenticate() {
  try {
    const user: User = UserSchema.parse(await api("/auth/user", "GET"));
    return user;
  } catch {
    throw redirect({ to: "/login" });
  }
}
