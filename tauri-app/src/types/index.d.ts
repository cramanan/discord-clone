import z, { ZodType } from "zod";
import {
  AppErrorSchema,
  ChatSchema,
  EventSchema,
  PageSchema,
  UserSchema,
} from "./schemas";

export type AppError = z.infer<typeof AppErrorSchema>;

export type User = z.infer<typeof UserSchema>;

export type Chat = z.infer<typeof ChatSchema>;

export type Event = z.infer<typeof EventSchema>;
