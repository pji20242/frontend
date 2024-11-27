import DeviceMap from '@/components/map'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="grow">
      <DeviceMap />
      test
    </div>
  )
}