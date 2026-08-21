import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/store/product')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/store/product"!</div>
}
