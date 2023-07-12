import { Outlet } from 'react-router-dom'

import { Sidebar } from './Sidebar'

export function DefaultLayout() {
  return (
    <div className="h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
