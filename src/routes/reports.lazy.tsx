import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/reports')({
  component: Reports,
})

function Reports() {
  return <div>Hello "/reports"!</div>
}
