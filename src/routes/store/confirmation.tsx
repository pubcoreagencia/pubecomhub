import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/store/confirmation')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/store/confirmation"!</div>
}
