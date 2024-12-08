import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboard/cooperatives')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h2 className="text-3xl mb-16">Cooperativas</h2>
      lkfjsdkfsfjkd
    </div>
  )
}
