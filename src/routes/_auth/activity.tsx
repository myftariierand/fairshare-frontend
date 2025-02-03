import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/activity')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/activity"!</div>
}
