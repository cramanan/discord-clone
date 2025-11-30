import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/_authed/discussions/$userUuid')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/discussions/$userId"!</div>
}
