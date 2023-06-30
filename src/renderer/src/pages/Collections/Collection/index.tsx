import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useQuery } from '@tanstack/react-query'

import { Spinner } from '../../../components/Spinner'
import { api } from '../../../lib/api'
import { CreateFolderModal } from './CreateFolderModal'
import { CreateRequestModal } from './CreateRequestModal'
import { Request } from './Request'
import { Response } from './Response'
import { Sidebar } from './Sidebar'
import { useRequestStore } from './stores/requestStore'
import { useResponseStore } from './stores/responseStore'

export type RequestType = {
  id: string
  name: string
  type: string
  parentId: string
  method: string
}

export type CollectionType = {
  id: string
  name: string
  projectId: string
  requestId: string
  requests: RequestType[]
}

export function Collection() {
  const { collectionId } = useParams<{
    collectionId: string
  }>()

  const responseLoading = useResponseStore((state) => state.loading)
  const responseData = useResponseStore((state) => state.data)
  const requestSelected = useRequestStore((state) => state.request)
  const selectRequest = useRequestStore((state) => state.selectRequest)
  const setResponseData = useResponseStore((state) => state.setResponseData)

  const { data: collection, isLoading: isCollectionLoading } = useQuery(
    ['collections', collectionId],
    async () => {
      const response = await api.get(`/collections/${collectionId}`)

      return response.data.collection
    },
    {
      refetchOnWindowFocus: false,
    },
  )

  useEffect(() => {
    selectRequest(null)
    setResponseData(null)
  }, [selectRequest, setResponseData])

  if (!collection && isCollectionLoading) {
    return (
      <div className="flex-1 flex flex-col gap-6 p-4">
        <div className="bg-zinc-200 h-8 w-56 animate-pulse" />

        <div className="flex-1 flex flex-col gap-2">
          {new Array(7).fill('').map((_, index) => (
            <div
              key={String(index)}
              className="bg-zinc-200 h-8 w-56 animate-pulse"
            />
          ))}
        </div>

        <div className="bg-zinc-200 h-8 w-56 animate-pulse" />
      </div>
    )
  }

  return (
    <>
      <CreateRequestModal />
      <CreateFolderModal />

      <div className="flex-1 flex overflow-auto">
        <Sidebar collection={collection!} />

        {requestSelected ? (
          <>
            <Request />

            {responseLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <>
                {responseData ? (
                  <Response />
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-sm">
                      To view response, send a request.
                    </span>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-sm">To start, select a request.</span>
          </div>
        )}
      </div>
    </>
  )
}
