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

export const PageSchema = <T extends z.ZodType>(zodType: T) =>
  z.object({
    data: z.array(zodType),
    total: z.number(),
    page: z.number(),
    perPage: z.number(),
  });

export const ChatSchema = z.object({
  id: z.number(),
  senderUuid: z.uuid(),
  receiverUuid: z.uuid(),
  content: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime().nullable(),
});

export const EventSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("MESSAGE"), payload: ChatSchema }),
  z.object({ type: z.literal("OTHER") }),
]);

export const RelationshipSchema = z.object({
  id: z.number(),
  requesterUuid: z.uuid(),
  addresseeUuid: z.uuid(),
  isPending: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime().nullable(),
});
