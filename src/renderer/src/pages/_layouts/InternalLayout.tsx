import { Outlet } from 'react-router-dom'

export function InternalLayout() {
  return (
    <div className="h-screen flex-1 flex flex-col overflow-auto">
      <Outlet />
    </div>
  )
}
