import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import clsx from 'clsx'
import { useAtom } from 'jotai'

import { Alert } from '@/components/Alert'
import { Context } from '@/components/Context'
import { api } from '@/lib/api'

import { RequestType, collectionAtom } from '../atoms'

interface RequestProps {
  request: RequestType
}

export function Request({ request }: RequestProps) {
  const { collectionId, requestId } = useParams<{
    collectionId: string
    requestId: string
  }>()

  const navigate = useNavigate()

  const [, setCollection] = useAtom(collectionAtom)

  const [deleteRequestAlertVisible, setDeleteRequestAlertVisible] =
    useState(false)
  const [loading, setLoading] = useState(false)

  function handleSelectRequest() {
    navigate(`/collections/${collectionId}/${request.id}`)
  }

  async function deleteRequest() {
    try {
      setLoading(false)

      await api.delete(`/requests/${request.id}`)

      setCollection((prevState: any) => ({
        ...prevState,
        requests: prevState.requests.filter(
          (item: any) => item.id !== request.id,
        ),
      }))

      if (requestId === request.id) {
        navigate(`/collections/${collectionId}`)
      }
    } finally {
      setLoading(true)
    }
  }

  return (
    <>
      <Alert
        open={deleteRequestAlertVisible}
        onOpenChange={setDeleteRequestAlertVisible}
        title="Delete request"
        description="Really want to delete this request?"
        isLoading={loading}
        actionText="Yes, delete"
        onAction={deleteRequest}
      />

      <Context.Root>
        <Context.Trigger>
          <div
            className="h-8 px-3 flex items-center text-sm hover:bg-zinc-200 cursor-pointer gap-2"
            onClick={handleSelectRequest}
          >
            <div
              className={clsx(
                'w-8 font-semibold text-[10px]',
                request.method === 'GET' && 'text-indigo-500',
                request.method === 'POST' && 'text-green-500',
                request.method === 'PUT' && 'text-orange-500',
                request.method === 'PATCH' && 'text-yellow-500',
                request.method === 'DELETE' && 'text-red-500',
              )}
            >
              {request.method}
            </div>

            {request.name}
          </div>
        </Context.Trigger>
        <Context.Content>
          <Context.Item onClick={() => setDeleteRequestAlertVisible(true)}>
            Delete
          </Context.Item>
        </Context.Content>
      </Context.Root>
    </>
  )
}
