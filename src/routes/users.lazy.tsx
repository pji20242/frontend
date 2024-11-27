import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/users')({
  component: Users,
})

function Users() {
  return <div className="p-2">users</div>
}
