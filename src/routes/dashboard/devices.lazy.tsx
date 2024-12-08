import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboard/devices')({
  component: Devices,
})


export function Devices() {

  return (
    <div>
      <h2 className="text-3xl mb-8">Dispositivos</h2>

      <div className="flex items-center py-4">
      </div>
    </div>
  )
}
