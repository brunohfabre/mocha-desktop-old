import { useNavigate } from 'react-router-dom'

import { Dropdown } from '@/components/Dropdown'
import { useOrganizations } from '@/services/organizations'
import { useOrganizationStore } from '@/stores/organizationStore'
import { Check } from '@phosphor-icons/react'

export function Organizations() {
  const navigate = useNavigate()

  const { data: organizations, isLoading: isOrganizationsLoading } =
    useOrganizations()

  const organizationSelected = useOrganizationStore(
    (state) => state.organization,
  )
  const selectOrganization = useOrganizationStore(
    (state) => state.selectOrganization,
  )

  const personalOrganization = organizations?.find(
    (organization) => organization.type === 'PERSONAL',
  )
  const filteredOrganizations = organizations?.filter(
    (organization) => organization.type !== 'PERSONAL',
  )

  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <div className="w-14 h-14 flex gap-2 items-center justify-center ursor-pointer bg-zinc-200 hover:bg-zinc-300">
          <span className="text-base font-semibold">
            {organizationSelected?.name[0]}
          </span>
        </div>
      </Dropdown.Trigger>

      <Dropdown.Content align="end">
        {!organizations && isOrganizationsLoading ? (
          <div className="h-64 flex items-center justify-center">
            <text>is loading</text>
          </div>
        ) : (
          <>
            <div className="text-xs h-6 flex items-center px-3 text-zinc-500">
              Personal account
            </div>
            <div className="flex flex-col py-1">
              <div className="h-[1px] bg-zinc-400" />
            </div>
            <Dropdown.Item
              className="justify-between"
              onClick={() => selectOrganization(personalOrganization!)}
            >
              {personalOrganization?.name}{' '}
              {personalOrganization?.id === organizationSelected?.id && (
                <Check weight="bold" />
              )}
            </Dropdown.Item>

            <div className="h-2" />

            <div className="text-xs h-6 flex items-center px-3 text-zinc-500">
              Organizations
            </div>
            <div className="flex flex-col py-1">
              <div className="h-[1px] bg-zinc-400" />
            </div>
            {filteredOrganizations?.map((organization) => (
              <Dropdown.Item
                key={organization.id}
                className="justify-between"
                onClick={() => selectOrganization(organization)}
              >
                {organization.name}

                {organizationSelected?.id === organization.id && (
                  <Check weight="bold" />
                )}
              </Dropdown.Item>
            ))}
            <Dropdown.Item onClick={() => navigate('/organizations/create')}>
              + New organization
            </Dropdown.Item>

            <Dropdown.Item onClick={() => navigate('/organizations')}>
              All organizations
            </Dropdown.Item>
          </>
        )}
      </Dropdown.Content>
    </Dropdown.Root>
  )
}
