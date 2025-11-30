/* @refresh reload */
import { render } from "solid-js/web";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/solid-router";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/solid-router" {
  interface Register {
    router: typeof router;
  }
}

import "./styles.css";

render(
  () => <RouterProvider router={router} />,
  document.getElementById("root") as HTMLElement
);
