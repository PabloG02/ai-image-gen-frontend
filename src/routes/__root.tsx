import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import {Header} from '@/components/Header'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Header />

          <Outlet />
          <TanStackRouterDevtools />
        </div>
      </div>
    </>
  ),
})
