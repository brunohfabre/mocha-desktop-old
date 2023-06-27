import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useQueryClient } from '@tanstack/react-query'

import { Alert } from '../../components/Alert'
import { Context } from '../../components/Context'
import { api } from '../../lib/api'

type CollectionType = {
  id: string
  name: string
}

interface CollectionCardProps {
  collection: CollectionType
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    try {
      setLoading(true)

      await api.delete(`/collections/${collection.id}`)

      queryClient.setQueryData(['collections'], (prevState: any) =>
        prevState.filter((item: any) => item.id !== collection.id),
      )

      setDeleteAlertVisible(false)
      setLoading(false)
    } finally {
      setLoading(false)
    }
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

      <Context.Root>
        <Context.Trigger>
          <div
            className="bg-zinc-100 p-4 hover:bg-zinc-200 cursor-pointer"
            onClick={() => navigate(`/collections/${collection.id}`)}
          >
            <span>{collection.name}</span>
          </div>
        </Context.Trigger>

        <Context.Content>
          <Context.Item onClick={() => setDeleteAlertVisible(true)}>
            delete
          </Context.Item>
        </Context.Content>
      </Context.Root>
    </>
  )
}
