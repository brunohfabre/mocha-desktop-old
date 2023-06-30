import { useNavigate } from 'react-router-dom'

import { CaretDown } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'

import { createUseOrganizationsKey } from '../../services/organizations/keys'
import { OrganizationType } from '../../services/organizations/types'
import { useOrganizationStore } from '../../stores/organizationStore'
import { Dropdown } from '../Dropdown'

export function Organizations() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const organizationSelected = useOrganizationStore(
    (state) => state.organization,
  )

  const organizations = queryClient.getQueryData<OrganizationType[]>(
    createUseOrganizationsKey(),
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
        <div className="text-xs h-8 flex items-center px-3 text-zinc-500">
          Personal account
        </div>
        <div className="flex flex-col py-1">
          <div className="h-[1px] bg-zinc-400" />
        </div>
        <Dropdown.Item>{organizationSelected?.name}</Dropdown.Item>

        <div className="h-2" />

        <div className="text-xs h-8 flex items-center px-3 text-zinc-500">
          Organizations
        </div>
        <div className="flex flex-col py-1">
          <div className="h-[1px] bg-zinc-400" />
        </div>
        {filteredOrganizations?.map((organization) => (
          <Dropdown.Item key={organization.id}>
            {organization.name}
          </Dropdown.Item>
        ))}
        <Dropdown.Item onClick={() => navigate('/organizations/create')}>
          + New organization
        </Dropdown.Item>

        <Dropdown.Item onClick={() => navigate('/organizations')}>
          All organizations
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  )
}
