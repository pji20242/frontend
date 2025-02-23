import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Toaster } from 'sonner'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Toaster richColors />
    </>
  ),
}) 