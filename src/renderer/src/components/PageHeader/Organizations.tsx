import { useNavigate } from 'react-router-dom'

import { CaretDown, Check } from '@phosphor-icons/react'

import { useOrganizations } from '../../services/organizations'
import { useOrganizationStore } from '../../stores/organizationStore'
import { Dropdown } from '../Dropdown'

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
        <div className="h-12 px-4 flex items-center gap-2 cursor-pointer hover:bg-blue-300">
          <span className="text-sm">{organizationSelected?.name}</span>

          <CaretDown weight="bold" />
        </div>
      </Dropdown.Trigger>

      <Dropdown.Content align="start">
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
