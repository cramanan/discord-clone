import { createFileRoute, Link, useNavigate } from "@tanstack/solid-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import z from "zod";
import { createForm } from "@tanstack/solid-form";
import { useMutation } from "@tanstack/solid-query";
import {
  TextField,
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
} from "~/components/ui/text-field";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { For } from "solid-js";
import Loader from "lucide-solid/icons/loader";
import { api } from "~/actions/api";

export const Route = createFileRoute("/_auth/login")({
  component: RouteComponent,
});

const schema = z.object({
  email: z.email(),
  password: z.string().trim().nonempty("password cannot be empty"),
});

type Payload = z.infer<typeof schema>;

function RouteComponent() {
  const navigate = useNavigate();
  const mutation = useMutation(() => ({
    mutationKey: ["login"],
    mutationFn: async (payload: Payload) =>
      await api("/auth/login", "POST", payload),
    onSuccess: () => navigate({ to: "/channels/@me" }),
    onError: (error) => console.log("Login error:", error.message),
  }));

  const form = createForm(() => ({
    validators: { onSubmit: schema },
    defaultValues: {
      email: "",
      password: "",
    } satisfies Payload,
    onSubmit: ({ value }) => mutation.mutate(value),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Log into your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          class="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field name="email">
            {(field) => (
              <TextField
                value={field().state.value}
                onChange={field().handleChange}
                validationState={
                  field().state.meta.isTouched && !field().state.meta.isValid
                    ? "invalid"
                    : "valid"
                }
              >
                <TextFieldLabel for={field().name}>Email:</TextFieldLabel>
                <TextFieldInput
                  id={field().name}
                  name={field().name}
                  type="text"
                  placeholder="example@email.com"
                />
                <For each={field().state.meta.errors}>
                  {(error) => (
                    <TextFieldErrorMessage>
                      {error?.message}
                    </TextFieldErrorMessage>
                  )}
                </For>
              </TextField>
            )}
          </form.Field>
          <form.Field name="password">
            {(field) => (
              <TextField
                value={field().state.value}
                onChange={field().handleChange}
                validationState={
                  field().state.meta.isTouched && !field().state.meta.isValid
                    ? "invalid"
                    : "valid"
                }
              >
                <TextFieldLabel for={field().name}>Password:</TextFieldLabel>
                <TextFieldInput
                  id={field().name}
                  name={field().name}
                  type="password"
                  placeholder="**********"
                />
                <For each={field().state.meta.errors}>
                  {(error) => (
                    <TextFieldErrorMessage>
                      {error?.message}
                    </TextFieldErrorMessage>
                  )}
                </For>
              </TextField>
            )}
          </form.Field>
          <Button type="submit" class="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? <Loader /> : "Login"}
          </Button>
          <Separator />
          <p>
            Don&apos;t have an account?{" "}
            <Link class="underline" to="/register">
              Sign up
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
