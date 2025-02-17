import { Link, Navigate, Outlet, createFileRoute } from '@tanstack/react-router'

import {
  HomeIcon,
  Router,
  Tractor,
  User,
} from 'lucide-react'

import { cn } from '@/lib/utils'

interface NavItemProps {
  icon: React.ElementType
  label: string
  to: string
}

function NavItem({ icon: Icon, label, to }: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        'relative flex items-center px-4 py-3 text-base font-medium transition-colors',
        'rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
        'text-on-surface hover:bg-surface-variant',
        '[&.active]:bg-primary [&.active]:text-on-primary',
        '[&.active]:text-white',
        'hover:ring-1 ring-blue-950',
      )}
    >
      <Icon className="mr-3 h-5 w-5" />

      <span>{label}</span>
    </Link>
  )
}
function Nav() {
  return (
    <div className="group flex flex-col gap-4 py-2 w-48 h-full border-r-2">
      <h1 className="mx-auto text-2xl my-8 font-bold">AgroTech</h1>

      <nav className="grid gap-2 px-4">
        <NavItem label="Home" icon={HomeIcon} to="/dashboard/home" />
        <NavItem label="Cooperativas" icon={Tractor} to="/dashboard/cooperatives" />
        <NavItem label="Usuários" icon={User} to="/dashboard/users" />
        <NavItem label="Dispositivos" icon={Router} to="/dashboard/devices" />
      </nav>
    </div>
  )
}

export const Route = createFileRoute('/dashboard')({
  component: LayoutComponent,
})

function LayoutComponent() {
  if (localStorage.getItem('jwt_token') === null) {
    return <Navigate to="/auth" />
  }

  return (
    <div className="flex h-dvh">
      <Nav />

      <div className="grow p-16">
        <Outlet />
      </div>
    </div>
  )
}
