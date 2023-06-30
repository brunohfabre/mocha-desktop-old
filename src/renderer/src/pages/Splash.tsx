import { Navigate } from 'react-router-dom'

import { useOrganizations } from '../services/organizations'
import { useOrganizationStore } from '../stores/organizationStore'

export function Splash() {
  const organizationSelected = useOrganizationStore(
    (state) => state.organization,
  )
  const selectOrganization = useOrganizationStore(
    (state) => state.selectOrganization,
  )

  const { data: organizations, isLoading: isOrganizationsLoading } =
    useOrganizations({
      onSuccess: (data) => {
        if (!organizationSelected) {
          const findOrganization = data.find((item) => item.type === 'PERSONAL')

          if (findOrganization) {
            selectOrganization(findOrganization)
          }
        }
      },
    })

  if (!organizations && isOrganizationsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>app-loading</p>
      </div>
    )
  }

  return <Navigate to="/" replace />
}
