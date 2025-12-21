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
import { api } from "~/actions/api";

export const Route = createFileRoute("/_auth/register")({
  component: RouteComponent,
});

const schema = z
  .object({
    name: z.string().trim().nonempty("name cannot be empty"),
    email: z.email(),
    password: z.string().trim().nonempty("password cannot be empty"),
    confirmPassword: z.string().trim().nonempty("password cannot be empty"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords don't match",
    path: ["confirmPassword"],
  });

type Payload = z.infer<typeof schema>;

function RouteComponent() {
  const navigate = useNavigate();
  const mutation = useMutation(() => ({
    mutationKey: ["register"],
    mutationFn: async (payload: Payload) =>
      await api("/auth/register", "POST", payload),
    onSuccess: () => navigate({ to: "/" }),
    onError: (error) => console.log("Registration error:", error.message),
  }));

  const form = createForm(() => ({
    validators: { onSubmit: schema },
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    } satisfies Payload,
    onSubmit: ({ value }) => mutation.mutate(value),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create an account</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          class="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field name="name">
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
                <TextFieldLabel for={field().name}>Name:</TextFieldLabel>
                <TextFieldInput
                  id={field().name}
                  name={field().name}
                  type="text"
                  placeholder="John Doe"
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
          <form.Field name="confirmPassword">
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
                <TextFieldLabel for={field().name}>
                  Confirm password:
                </TextFieldLabel>
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
          <Button type="submit" class="w-full">
            Register
          </Button>
          <Separator />
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
