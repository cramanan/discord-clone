import { createFileRoute, Outlet } from "@tanstack/solid-router";
import { authenticate } from "~/actions/loaders";
import MainSidebar from "~/components/layouts/main-layout";

export const Route = createFileRoute("/_authed")({
  beforeLoad: async () => {
    const user = await authenticate();
    return { user };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const loaderData = Route.useRouteContext();
  return (
    <MainSidebar user={loaderData().user}>
      <Outlet />
    </MainSidebar>
  );
}
