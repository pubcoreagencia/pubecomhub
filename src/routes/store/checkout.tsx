import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/store/checkout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/store/checkout"!</div>
}
