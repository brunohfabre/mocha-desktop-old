import { Outlet } from 'react-router-dom'

import { PageHeader } from '../../../components/PageHeader'
import { Sidebar } from './Sidebar'

export function DefaultLayout() {
  return (
    <div className="h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-auto">
        <PageHeader showBackButton={false} />

        <Outlet />
      </div>
    </div>
  )
}
