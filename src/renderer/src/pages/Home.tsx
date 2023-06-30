import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useQueryClient } from '@tanstack/react-query'

import { createUseOrganizationsKey } from '../services/organizations/keys'

export function Home() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    const organizations = queryClient.getQueryData(createUseOrganizationsKey())

    if (!organizations) {
      navigate('/splash', {
        replace: true,
      })
    }
  }, [navigate, queryClient])

  return (
    <div className="p-4">
      <h1>Home</h1>
    </div>
  )
}
