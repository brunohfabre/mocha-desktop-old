import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { CaretRight } from '@phosphor-icons/react'
import * as Accordion from '@radix-ui/react-accordion'

import { RequestType } from '..'

import { useQueryClient } from '@tanstack/react-query'

import { Alert } from '../../../../components/Alert'
import { Button } from '../../../../components/Button'
import { Context } from '../../../../components/Context'
import { api } from '../../../../lib/api'
import { useCreateFolderModalStore } from '../CreateFolderModal/createFolderModalStore'
import { useCreateRequestModalStore } from '../CreateRequestModal/createRequestModalStore'
import { Request } from './Request'

interface FolderProps {
  request: RequestType
  requests: RequestType[]
}

export function Folder({ request, requests }: FolderProps) {
  const queryClient = useQueryClient()

  const { collectionId } = useParams<{ collectionId: string }>()

  const changeCreateRequestModalVisibility = useCreateRequestModalStore(
    (state) => state.changeVisibility,
  )
  const changeCreateFolderModalVisibility = useCreateFolderModalStore(
    (state) => state.changeVisibility,
  )

  const [deleteFolderAlertVisible, setDeleteFolderAlertVisible] =
    useState(false)
  const [loading, setLoading] = useState(false)

  const content = requests.filter((item) => item.parentId === request.id)

  async function deleteFolder() {
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
    } finally {
      setLoading(true)
    }
  }

  return (
    <>
      <Alert
        open={deleteFolderAlertVisible}
        onOpenChange={setDeleteFolderAlertVisible}
        title="Delete folder"
        description="Really want to delete this folder?"
        isLoading={loading}
        actionText="Yes, delete"
        onAction={deleteFolder}
      />

      <Context.Root>
        <Context.Trigger>
          <Accordion.Root type="multiple">
            <Accordion.Item value={request.id} className="flex flex-col">
              <Accordion.Trigger className="flex items-center h-8 px-2 gap-2 group hover:bg-zinc-200">
                <CaretRight
                  size={12}
                  weight="bold"
                  className="group-data-[state=open]:rotate-90"
                />{' '}
                <span className="text-sm">{request.name}</span>
              </Accordion.Trigger>
              <Accordion.Content className="pl-2">
                {!content.length && (
                  <div className="flex-1 flex flex-col p-4 gap-2 items-center justify-center">
                    <Button
                      type="button"
                      onClick={() =>
                        changeCreateRequestModalVisibility(request.id)
                      }
                    >
                      + Request
                    </Button>
                    <Button
                      type="button"
                      onClick={() =>
                        changeCreateFolderModalVisibility(request.id)
                      }
                    >
                      + Folder
                    </Button>
                  </div>
                )}

                {content.map((request) =>
                  request.type === 'REQUEST' ? (
                    <Request key={request.id} request={request} />
                  ) : (
                    <Folder
                      key={request.id}
                      request={request}
                      requests={requests}
                    />
                  ),
                )}
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </Context.Trigger>
        <Context.Content>
          <Context.Item
            onClick={() => changeCreateRequestModalVisibility(request.id)}
          >
            Create request
          </Context.Item>

          <Context.Item
            onClick={() => changeCreateFolderModalVisibility(request.id)}
          >
            Create folder
          </Context.Item>

          <Context.Item onClick={() => setDeleteFolderAlertVisible(true)}>
            Delete
          </Context.Item>
        </Context.Content>
      </Context.Root>
    </>
  )
}
