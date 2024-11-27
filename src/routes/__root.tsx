import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import { ChartNoAxesCombined, HomeIcon, Router, Tractor, User } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
}

function NavItem({ icon: Icon, label, to }: NavItemProps) {
  return (
    <Link to={to} className={cn(
      "[&.active]:font-bold",
      "[&.active]:text-white",
      "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
      buttonVariants({ variant: "default" }),
    )}>
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Link>
  )
}

function Nav() {
  return (
    <div className="group flex flex-col gap-4 py-2 w-48 h-full border-r-2">
      <h1 className="mx-auto text-2xl my-8 font-bold">PJI3</h1>

      <nav className="grid gap-1 px-2">
        <NavItem label="Home" icon={HomeIcon} to="/" />
        <NavItem label="Cooperativas" icon={Tractor} to="/cooperatives" />
        <NavItem label="Usuários" icon={User} to="/users" />
        <NavItem label="Dispositivos" icon={Router} to="/devices" />
        <NavItem label="Relatórios" icon={ChartNoAxesCombined} to="/reports" />
      </nav>
    </div >
  );
}



export const Route = createRootRoute({
  component: () => (
    <div className='flex h-dvh'>
      <Nav />

      <div className="grow p-16 min-w-full">
        <Outlet />
        <TanStackRouterDevtools />
      </div>
    </div>
  ),
})