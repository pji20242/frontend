import DeviceMap from '@/components/map'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className='min-w-full flex flex-col'>
      <h2 className='text-3xl mb-16'>Home</h2>

      <div className='grow'>
        <DeviceMap />
      </div>
    </div>
  )
}