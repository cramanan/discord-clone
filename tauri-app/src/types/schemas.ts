import z from "zod";

export const AppErrorSchema = z.object({
  message: z.string(),
});

export const UserSchema = z.object({
  uuid: z.uuid(),
  name: z.string(),
  email: z.email(),
  avatar: z.string().nullable(),
});
