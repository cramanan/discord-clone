import z, { ZodType } from "zod";
import {
  AppErrorSchema,
  FriendshipSchema,
  PageSchema,
  UserSchema,
} from "./schemas";

export type AppError = z.infer<typeof AppErrorSchema>;

export type User = z.infer<typeof UserSchema>;

export type Friendship = z.infer<typeof FriendshipSchema>;
