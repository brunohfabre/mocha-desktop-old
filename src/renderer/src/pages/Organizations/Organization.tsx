import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { api } from '../../lib/api'
import { useAuthStore } from '../../stores/authStore'

type UserType = {
  id: string
  email: string
  name: string
}

type MemberType = {
  id: string
  userId: string
  user: UserType
  role: string
  acceptedAt: string
  createdAt: string
}

type OrganizationType = {
  id: string
  name: string
  type: string
  createdAt: string
  members: MemberType[]
}

export function Organization() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user)

  const queryClient = useQueryClient()

  const [loading, setLoading] = useState(false)
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false)

  const { data: organization, isLoading: isOrganizationLoading } =
    useQuery<OrganizationType>(['organizations', id], async () => {
      const response = await api.get(`/organizations/${id}`)

      return response.data.organization
    })

  const isOwner = organization?.members.some(
    (member) => member.userId === user?.id && member.role === 'OWNER',
  )

  async function handleDelete() {
    try {
      setLoading(true)

      await api.delete(`/organizations/${id}`)

      queryClient.setQueryData(['organizations'], (prevState: any) =>
        prevState.filter((organization: any) => organization.id !== id),
      )

      navigate(-1)
    } finally {
      setLoading(false)
    }
  }

  if (!organization && isOrganizationLoading) {
    return <div>isLoading</div>
  }

  return (
    <>
      <Alert
        open={deleteAlertVisible}
        onOpenChange={setDeleteAlertVisible}
        title="Delete organization"
        description="Really want to delete this organization?"
        actionText="Yes, delete"
        onAction={handleDelete}
        isLoading={loading}
      />

      <div className="p-4 flex flex-col max-w-3xl w-full mx-auto">
        <h1>{organization?.name}</h1>

        {isOwner && (
          <div>
            <span>Delete organization</span>

            <Button
              type="button"
              variant="danger"
              onClick={() => setDeleteAlertVisible(true)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
