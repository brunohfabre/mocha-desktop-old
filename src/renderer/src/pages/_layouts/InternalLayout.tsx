import { Outlet } from 'react-router-dom'

import { PageHeader } from '../../components/PageHeader'

export function InternalLayout() {
  return (
    <div className="h-screen flex-1 flex flex-col overflow-auto">
      <PageHeader showOrganizations={false} />

      <Outlet />
    </div>
  )
}
