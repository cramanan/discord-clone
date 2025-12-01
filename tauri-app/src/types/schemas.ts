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

export const FriendshipSchema = z.object({
  id: z.number(),
  requesterUuid: z.uuid(),
  addresseeUuid: z.uuid(),
  isPending: z.boolean(),
});

export const PageSchema = <T extends z.ZodType>(zodType: T) =>
  z.object({
    data: z.array(zodType),
    total: z.number(),
  });
