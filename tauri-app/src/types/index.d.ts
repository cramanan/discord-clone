import z, { ZodType } from "zod";
import {
  AppErrorSchema,
  ChatSchema,
  FriendshipSchema,
  PageSchema,
  UserSchema,
} from "./schemas";

export type AppError = z.infer<typeof AppErrorSchema>;

export type User = z.infer<typeof UserSchema>;

export type Chat = z.infer<typeof ChatSchema>;
