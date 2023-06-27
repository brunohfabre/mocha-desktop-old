import { Outlet, useLocation } from 'react-router-dom'

import { PageHeader } from '../../components/PageHeader'
import { useProjectStore } from '../../stores/projectStore'

export function InternalLayout() {
  const location = useLocation()

  const project = useProjectStore((state) => state.project)

  return (
    <div className="h-screen flex-1 flex flex-col overflow-auto">
      <PageHeader
        showBackButton={
          project
            ? true
            : location.pathname !== '/organizations' &&
              location.pathname.split('/').filter((item) => !!item).length > 1
        }
      />

      <Outlet />
    </div>
  )
}
