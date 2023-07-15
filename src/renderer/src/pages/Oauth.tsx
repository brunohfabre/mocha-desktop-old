import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { api } from '@/lib/api'
import { OrganizationType } from '@/services/organizations/types'
import { useAuthStore } from '@/stores/authStore'
import { useOrganizationStore } from '@/stores/organizationStore'

export function Oauth() {
  const navigate = useNavigate()
  const location = useLocation()

  const setCredentials = useAuthStore((state) => state.setCredentials)
  const selectOrganization = useOrganizationStore(
    (state) => state.selectOrganization,
  )

  useEffect(() => {
    async function loadOauthData() {
      const response = await api.post('/oauth/sessions', {
        token: location.state.token,
      })

      const { token, user, organizations } = response.data

      setCredentials({
        token,
        user,
      })

      const findOrganization = organizations.find(
        (organization: OrganizationType) => organization.type === 'PERSONAL',
      )

      if (findOrganization) {
        selectOrganization(findOrganization)
      }

      navigate('/', {
        replace: true,
      })
    }

    loadOauthData()
  }, [location, navigate, selectOrganization, setCredentials])

  return (
    <div className="flex-1 flex items-center justify-center">
      <p>oauth</p>
    </div>
  )
}
