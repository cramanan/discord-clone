import { useQuery } from "@tanstack/solid-query";
import { createFileRoute, redirect } from "@tanstack/solid-router";
import { createSignal, For } from "solid-js";
import { api } from "~/actions/api";
import { Logo } from "~/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { TextField, TextFieldTextArea } from "~/components/ui/text-field";
import { ChatSchema, PageSchema, UserSchema } from "~/types/schemas";

export const Route = createFileRoute("/_authed/channels/@me/$uuid")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    try {
      const receiver = await api(`/users/${params.uuid}`, "GET").then(
        UserSchema.parse
      );

      return { sender: context.user, receiver };
    } catch {
      throw redirect({ to: "/channels/@me" });
    }
  },
});

function RouteComponent() {
  const loader = Route.useLoaderData();
  const query = useQuery(() => ({
    queryKey: ["messages", loader().receiver.uuid],
    queryFn: async () =>
      await api(`/@me/chats/${loader().receiver.uuid}`, "GET").then(
        PageSchema(ChatSchema).parse
      ),
  }));

  const userByUUID = Object.fromEntries(
    [loader().receiver, loader().sender].map((user) => [user.uuid, user])
  );

  const [message, setMessage] = createSignal("");

  return (
    <div class="border-t border-accent h-full flex flex-col">
      <div class="border-b border-accent w-full h-12 p-2 flex items-center gap-2">
        <Avatar class="size-6">
          <AvatarImage src={loader().receiver.avatar ?? ""} />
          <AvatarFallback>
            <Logo class="size-4" />
          </AvatarFallback>
        </Avatar>
        <span>{loader().receiver.name}</span>
      </div>
      <div class="flex-1 flex flex-col-reverse px-2">
        <For each={query.data?.data}>
          {(chat) => (
            <div>
              <Avatar>
                <AvatarImage src={userByUUID[chat.senderUuid].avatar ?? ""} />
                <AvatarFallback>
                  <Logo class="size-6" />
                </AvatarFallback>
              </Avatar>
              <p>{chat.content}</p>
            </div>
          )}
        </For>
      </div>
      <TextField class="p-2" value={message()} onChange={setMessage}>
        <TextFieldTextArea
          class="h-14 pl-16"
          placeholder={`Envoyer un message à ${loader().receiver.name}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              setMessage("");
            }
          }}
        />
      </TextField>
    </div>
  );
}
