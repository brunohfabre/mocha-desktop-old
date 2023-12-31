import { useState } from 'react'

import { useAtom } from 'jotai'

import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Context } from '@/components/Context'
import { api } from '@/lib/api'
import { CaretRight } from '@phosphor-icons/react'
import * as Accordion from '@radix-ui/react-accordion'

import { RequestType, collectionAtom } from '../atoms'
import { createFolderModalVisibleAtom } from './CreateFolderModal/atoms'
import { createRequestModalVisibleAtom } from './CreateRequestModal/atoms'
import { Request } from './Request'

interface FolderProps {
  request: RequestType
  requests: RequestType[]
}

export function Folder({ request, requests }: FolderProps) {
  const [, setCollection] = useAtom(collectionAtom)
  const [, setCreateRequestModalVisible] = useAtom(
    createRequestModalVisibleAtom,
  )
  const [, setCreateFolderModalVisible] = useAtom(createFolderModalVisibleAtom)

  const [deleteFolderAlertVisible, setDeleteFolderAlertVisible] =
    useState(false)
  const [loading, setLoading] = useState(false)

  const content = requests.filter((item) => item.parentId === request.id)

  async function deleteFolder() {
    try {
      setLoading(true)

      await api.delete(`/requests/${request.id}`)

      setCollection((prevState: any) => ({
        ...prevState,
        requests: prevState.requests.filter(
          (item: any) => item.id !== request.id,
        ),
      }))
    } finally {
      setLoading(false)
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
                      onClick={() => setCreateRequestModalVisible(request.id)}
                    >
                      + Request
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCreateFolderModalVisible(request.id)}
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
            onClick={() => setCreateRequestModalVisible(request.id)}
          >
            Create request
          </Context.Item>

          <Context.Item onClick={() => setCreateFolderModalVisible(request.id)}>
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
