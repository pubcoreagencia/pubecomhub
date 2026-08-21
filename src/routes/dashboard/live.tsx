import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/live')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/live"!</div>
}
