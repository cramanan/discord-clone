import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { createRootRoute, Outlet } from "@tanstack/solid-router";
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools";
import { createEffect, ParentProps } from "solid-js";
import { Flex } from "~/components/ui/flex";

const queryClient = new QueryClient();

function StatebarProvider(props: ParentProps) {
  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="center"
        class="text-sm h-8 bg-sidebar font-light"
      >
        Amis
      </Flex>
      {props.children}
    </>
  );
}

function RootLayout() {
  createEffect(() => void document.documentElement.classList.add("dark"));
  return (
    <QueryClientProvider client={queryClient}>
      <StatebarProvider>
        <Outlet />
      </StatebarProvider>
      <TanStackRouterDevtools position="bottom-right" />
    </QueryClientProvider>
  );
}

export const Route = createRootRoute({ component: RootLayout });
