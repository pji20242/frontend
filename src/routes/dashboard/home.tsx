import DeviceMap from '@/components/map'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/home')({
  component: Index,
})

function Index() {
  return (
    <div className="min-w-full h-full flex flex-col space-y-4">
      <h2 className="text-3xl mb-16 flex-shrink-0">Home</h2>

      <div className="flex-1">
        <DeviceMap />
      </div>
    </div>
  )
}
