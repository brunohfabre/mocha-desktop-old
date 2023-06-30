import { useNavigate } from 'react-router-dom'

import { Button } from '../../components/Button'
import { useOrganizations } from '../../services/organizations'
import { OrganizationType } from '../../services/organizations/types'
import { useOrganizationStore } from '../../stores/organizationStore'

export function Organizations() {
  const navigate = useNavigate()

  const selectOrganization = useOrganizationStore(
    (state) => state.selectOrganization,
  )

  const { data: organizations, isLoading: isOrganizationsLoading } =
    useOrganizations()

  function handleSelectOrganization(organization: OrganizationType) {
    selectOrganization(organization)
    navigate('/', {
      replace: true,
    })
  }

  if (!organizations && isOrganizationsLoading) {
    return (
      <div className="flex flex-col p-4 gap-4">
        <div className="flex justify-between items-center">
          <div className="bg-zinc-200 h-4 w-24 animate-pulse" />

          <div className="bg-zinc-200 h-8 w-32 animate-pulse" />
        </div>

        {new Array(2).fill('').map((_, index) => (
          <div key={String(index)} className="flex flex-col gap-2">
            <div className="bg-zinc-200 h-4 w-24 animate-pulse" />

            <div className="bg-zinc-200 h-32 w-full animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex-1 flex overflow-auto">
      <div className="flex-1 flex flex-col max-w-7xl mx-auto p-4 gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-base font-medium">Organizations</h1>

          <Button onClick={() => navigate('/organizations/create')}>
            + New organization
          </Button>
        </div>

        {!organizations?.length && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-base font-semibold">No organizations</p>
          </div>
        )}

        {!!organizations?.length && (
          <div className="grid grid-cols-4 gap-4">
            {organizations?.map((organization) => (
              <button
                key={organization.id}
                type="button"
                className="bg-zinc-200 h-32 flex p-4 text-sm hover:bg-zinc-300"
                onClick={() => handleSelectOrganization(organization)}
              >
                {organization.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
