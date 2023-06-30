import { UseQueryOptions, useQuery } from '@tanstack/react-query'

import { api } from '../../lib/api'
import { createUseOrganizationsKey } from './keys'
import { OrganizationType } from './types'

export const useOrganizations = (
  options?: UseQueryOptions<OrganizationType[]>,
) => {
  return useQuery(
    createUseOrganizationsKey(),
    async () => {
      const response = await api.get('/organizations')

      return response.data.organizations
    },
    options,
  )
}
