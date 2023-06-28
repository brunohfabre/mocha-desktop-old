import { useState } from 'react'
import { useParams } from 'react-router-dom'

import clsx from 'clsx'

import { useQueryClient } from '@tanstack/react-query'

import { Alert } from '../../../../components/Alert'
import { Context } from '../../../../components/Context'
import { api } from '../../../../lib/api'

import { RequestType } from '..'

import { useRequestStore } from '../stores/requestStore'
import { useResponseStore } from '../stores/responseStore'

interface RequestProps {
  request: RequestType
}

export function Request({ request }: RequestProps) {
  const queryClient = useQueryClient()

  const { collectionId } = useParams<{
    collectionId: string
  }>()

  const selectRequest = useRequestStore((state) => state.selectRequest)
  const requestSelected = useRequestStore((state) => state.request)
  const setResponseData = useResponseStore((state) => state.setResponseData)

  const [deleteRequestAlertVisible, setDeleteRequestAlertVisible] =
    useState(false)
  const [loading, setLoading] = useState(false)

  async function deleteRequest() {
    try {
      setLoading(false)

      await api.delete(`/requests/${request.id}`)

      queryClient.setQueryData(
        ['collections', collectionId],
        (prevState: any) => ({
          ...prevState,
          requests: prevState.requests.filter(
            (item: any) => item.id !== request.id,
          ),
        }),
      )

      if (request.id === requestSelected?.id) {
        selectRequest(null)
        setResponseData(null)
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
            onClick={() => {
              selectRequest(request)
              setResponseData(null)
            }}
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
