import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/cooperatives')({
  component: Cooperatives,
})

function Cooperatives() {
  return <div className="p-2">cooperatives</div>
}
