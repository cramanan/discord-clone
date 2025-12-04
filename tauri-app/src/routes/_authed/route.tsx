import { createFileRoute, Outlet } from "@tanstack/solid-router";
import { authenticate } from "~/actions/loaders";
import { MainLayout } from "~/components/layouts/main-layout";

export const Route = createFileRoute("/_authed")({
  beforeLoad: async () => {
    const user = await authenticate();
    return { user };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const context = Route.useRouteContext();
  return (
    <MainLayout user={context().user}>
      <Outlet />
    </MainLayout>
  );
}
