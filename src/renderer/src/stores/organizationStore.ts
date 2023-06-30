import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type OrganizationType = {
  id: string
  name: string
  type: string
}

interface Store {
  organization: OrganizationType | null
  selectOrganization: (organization: OrganizationType | null) => void
}

export const useOrganizationStore = create(
  persist<Store>(
    (set) => ({
      organization: null,
      selectOrganization: (organization: OrganizationType | null) =>
        set(() => ({
          organization,
        })),
    }),
    {
      name: 'organization',
    },
  ),
)
