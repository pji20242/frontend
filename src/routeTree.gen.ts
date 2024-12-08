/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as DashboardImport } from './routes/dashboard'
import { Route as IndexImport } from './routes/index'
import { Route as DashboardIndexImport } from './routes/dashboard/index'
import { Route as AuthIndexImport } from './routes/auth/index'
import { Route as DashboardHomeImport } from './routes/dashboard/home'

// Create Virtual Routes

const DashboardUsersLazyImport = createFileRoute('/dashboard/users')()
const DashboardReportsLazyImport = createFileRoute('/dashboard/reports')()
const DashboardDevicesLazyImport = createFileRoute('/dashboard/devices')()
const DashboardCooperativesLazyImport = createFileRoute(
  '/dashboard/cooperatives',
)()

// Create/Update Routes

const DashboardRoute = DashboardImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const DashboardIndexRoute = DashboardIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => DashboardRoute,
} as any)

const AuthIndexRoute = AuthIndexImport.update({
  id: '/auth/',
  path: '/auth/',
  getParentRoute: () => rootRoute,
} as any)

const DashboardUsersLazyRoute = DashboardUsersLazyImport.update({
  id: '/users',
  path: '/users',
  getParentRoute: () => DashboardRoute,
} as any).lazy(() =>
  import('./routes/dashboard/users.lazy').then((d) => d.Route),
)

const DashboardReportsLazyRoute = DashboardReportsLazyImport.update({
  id: '/reports',
  path: '/reports',
  getParentRoute: () => DashboardRoute,
} as any).lazy(() =>
  import('./routes/dashboard/reports.lazy').then((d) => d.Route),
)

const DashboardDevicesLazyRoute = DashboardDevicesLazyImport.update({
  id: '/devices',
  path: '/devices',
  getParentRoute: () => DashboardRoute,
} as any).lazy(() =>
  import('./routes/dashboard/devices.lazy').then((d) => d.Route),
)

const DashboardCooperativesLazyRoute = DashboardCooperativesLazyImport.update({
  id: '/cooperatives',
  path: '/cooperatives',
  getParentRoute: () => DashboardRoute,
} as any).lazy(() =>
  import('./routes/dashboard/cooperatives.lazy').then((d) => d.Route),
)

const DashboardHomeRoute = DashboardHomeImport.update({
  id: '/home',
  path: '/home',
  getParentRoute: () => DashboardRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/dashboard': {
      id: '/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof DashboardImport
      parentRoute: typeof rootRoute
    }
    '/dashboard/home': {
      id: '/dashboard/home'
      path: '/home'
      fullPath: '/dashboard/home'
      preLoaderRoute: typeof DashboardHomeImport
      parentRoute: typeof DashboardImport
    }
    '/dashboard/cooperatives': {
      id: '/dashboard/cooperatives'
      path: '/cooperatives'
      fullPath: '/dashboard/cooperatives'
      preLoaderRoute: typeof DashboardCooperativesLazyImport
      parentRoute: typeof DashboardImport
    }
    '/dashboard/devices': {
      id: '/dashboard/devices'
      path: '/devices'
      fullPath: '/dashboard/devices'
      preLoaderRoute: typeof DashboardDevicesLazyImport
      parentRoute: typeof DashboardImport
    }
    '/dashboard/reports': {
      id: '/dashboard/reports'
      path: '/reports'
      fullPath: '/dashboard/reports'
      preLoaderRoute: typeof DashboardReportsLazyImport
      parentRoute: typeof DashboardImport
    }
    '/dashboard/users': {
      id: '/dashboard/users'
      path: '/users'
      fullPath: '/dashboard/users'
      preLoaderRoute: typeof DashboardUsersLazyImport
      parentRoute: typeof DashboardImport
    }
    '/auth/': {
      id: '/auth/'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof AuthIndexImport
      parentRoute: typeof rootRoute
    }
    '/dashboard/': {
      id: '/dashboard/'
      path: '/'
      fullPath: '/dashboard/'
      preLoaderRoute: typeof DashboardIndexImport
      parentRoute: typeof DashboardImport
    }
  }
}

// Create and export the route tree

interface DashboardRouteChildren {
  DashboardHomeRoute: typeof DashboardHomeRoute
  DashboardCooperativesLazyRoute: typeof DashboardCooperativesLazyRoute
  DashboardDevicesLazyRoute: typeof DashboardDevicesLazyRoute
  DashboardReportsLazyRoute: typeof DashboardReportsLazyRoute
  DashboardUsersLazyRoute: typeof DashboardUsersLazyRoute
  DashboardIndexRoute: typeof DashboardIndexRoute
}

const DashboardRouteChildren: DashboardRouteChildren = {
  DashboardHomeRoute: DashboardHomeRoute,
  DashboardCooperativesLazyRoute: DashboardCooperativesLazyRoute,
  DashboardDevicesLazyRoute: DashboardDevicesLazyRoute,
  DashboardReportsLazyRoute: DashboardReportsLazyRoute,
  DashboardUsersLazyRoute: DashboardUsersLazyRoute,
  DashboardIndexRoute: DashboardIndexRoute,
}

const DashboardRouteWithChildren = DashboardRoute._addFileChildren(
  DashboardRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/dashboard': typeof DashboardRouteWithChildren
  '/dashboard/home': typeof DashboardHomeRoute
  '/dashboard/cooperatives': typeof DashboardCooperativesLazyRoute
  '/dashboard/devices': typeof DashboardDevicesLazyRoute
  '/dashboard/reports': typeof DashboardReportsLazyRoute
  '/dashboard/users': typeof DashboardUsersLazyRoute
  '/auth': typeof AuthIndexRoute
  '/dashboard/': typeof DashboardIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/dashboard/home': typeof DashboardHomeRoute
  '/dashboard/cooperatives': typeof DashboardCooperativesLazyRoute
  '/dashboard/devices': typeof DashboardDevicesLazyRoute
  '/dashboard/reports': typeof DashboardReportsLazyRoute
  '/dashboard/users': typeof DashboardUsersLazyRoute
  '/auth': typeof AuthIndexRoute
  '/dashboard': typeof DashboardIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/dashboard': typeof DashboardRouteWithChildren
  '/dashboard/home': typeof DashboardHomeRoute
  '/dashboard/cooperatives': typeof DashboardCooperativesLazyRoute
  '/dashboard/devices': typeof DashboardDevicesLazyRoute
  '/dashboard/reports': typeof DashboardReportsLazyRoute
  '/dashboard/users': typeof DashboardUsersLazyRoute
  '/auth/': typeof AuthIndexRoute
  '/dashboard/': typeof DashboardIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/dashboard'
    | '/dashboard/home'
    | '/dashboard/cooperatives'
    | '/dashboard/devices'
    | '/dashboard/reports'
    | '/dashboard/users'
    | '/auth'
    | '/dashboard/'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/dashboard/home'
    | '/dashboard/cooperatives'
    | '/dashboard/devices'
    | '/dashboard/reports'
    | '/dashboard/users'
    | '/auth'
    | '/dashboard'
  id:
    | '__root__'
    | '/'
    | '/dashboard'
    | '/dashboard/home'
    | '/dashboard/cooperatives'
    | '/dashboard/devices'
    | '/dashboard/reports'
    | '/dashboard/users'
    | '/auth/'
    | '/dashboard/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  DashboardRoute: typeof DashboardRouteWithChildren
  AuthIndexRoute: typeof AuthIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  DashboardRoute: DashboardRouteWithChildren,
  AuthIndexRoute: AuthIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/dashboard",
        "/auth/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/dashboard": {
      "filePath": "dashboard.tsx",
      "children": [
        "/dashboard/home",
        "/dashboard/cooperatives",
        "/dashboard/devices",
        "/dashboard/reports",
        "/dashboard/users",
        "/dashboard/"
      ]
    },
    "/dashboard/home": {
      "filePath": "dashboard/home.tsx",
      "parent": "/dashboard"
    },
    "/dashboard/cooperatives": {
      "filePath": "dashboard/cooperatives.lazy.tsx",
      "parent": "/dashboard"
    },
    "/dashboard/devices": {
      "filePath": "dashboard/devices.lazy.tsx",
      "parent": "/dashboard"
    },
    "/dashboard/reports": {
      "filePath": "dashboard/reports.lazy.tsx",
      "parent": "/dashboard"
    },
    "/dashboard/users": {
      "filePath": "dashboard/users.lazy.tsx",
      "parent": "/dashboard"
    },
    "/auth/": {
      "filePath": "auth/index.tsx"
    },
    "/dashboard/": {
      "filePath": "dashboard/index.tsx",
      "parent": "/dashboard"
    }
  }
}
ROUTE_MANIFEST_END */
