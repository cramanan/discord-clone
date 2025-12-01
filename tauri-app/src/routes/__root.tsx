import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { createRootRoute, Outlet } from "@tanstack/solid-router";
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools";
import { createEffect } from "solid-js";

const queryClient = new QueryClient();

function RootLayout() {
  createEffect(() => void document.documentElement.classList.add("dark"));
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </QueryClientProvider>
  );
}

export const Route = createRootRoute({ component: RootLayout });
