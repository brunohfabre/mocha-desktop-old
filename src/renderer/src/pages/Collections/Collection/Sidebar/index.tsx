import { ResizableBox } from 'react-resizable'

import { CaretDown, DotsThree } from '@phosphor-icons/react'

import { CollectionType } from '..'

import { Button } from '../../../../components/Button'
import { Context } from '../../../../components/Context'
import { IconButton } from '../../../../components/IconButton'
import { Spinner } from '../../../../components/Spinner'
import { useCreateFolderModalStore } from '../CreateFolderModal/createFolderModalStore'
import { useCreateRequestModalStore } from '../CreateRequestModal/createRequestModalStore'
import { Folder } from './Folder'
import { Request } from './Request'

interface SidebarProps {
  collection: CollectionType
}

export function Sidebar({ collection }: SidebarProps) {
  const changeCreateRequestModalVisibility = useCreateRequestModalStore(
    (state) => state.changeVisibility,
  )
  const changeCreateFolderModalVisibility = useCreateFolderModalStore(
    (state) => state.changeVisibility,
  )

  const content = collection?.requests.filter(
    (request) => request.parentId === collection.request_id,
  )

  return (
    <ResizableBox
      width={240}
      height={Infinity}
      axis="x"
      resizeHandles={['e']}
      className="flex relative border-r border-red-500 z-[1]"
      minConstraints={[16, Infinity]}
      maxConstraints={[640, Infinity]}
      handle={
        <div className="w-4 h-10 bg-violet-500 p-1.5 flex rounded-full absolute right-[-8px] top-[50%] translate-y-[-50%] cursor-ew-resize">
          <div className="flex-1 bg-zinc-300 rounded-full" />
        </div>
      }
    >
      <div className="flex-1 flex flex-col">
        <header className="flex h-10 bg-red-100 items-center justify-between pl-4 pr-1">
          <div className="flex-1 flex items-center gap-2">
            <span className="text-sm">{collection?.name} </span>

            {false && <Spinner />}
          </div>

          <IconButton type="button" size="sm">
            <DotsThree size={16} weight="bold" />
          </IconButton>
        </header>

        <Context.Root>
          <Context.Trigger>
            <div className="flex-1 flex flex-col bg-zinc-100 p-2">
              {!content?.length && (
                <div className="flex-1 flex flex-col p-4 gap-2 items-center justify-center">
                  <Button
                    type="button"
                    onClick={() =>
                      changeCreateRequestModalVisibility(collection.request_id)
                    }
                  >
                    + Request
                  </Button>
                  <Button
                    type="button"
                    onClick={() =>
                      changeCreateFolderModalVisibility(collection.request_id)
                    }
                  >
                    + Folder
                  </Button>
                </div>
              )}

              {content?.map((request) =>
                request.type === 'REQUEST' ? (
                  <Request key={request.id} request={request} />
                ) : (
                  <Folder
                    key={request.id}
                    request={request}
                    requests={collection.requests}
                  />
                ),
              )}
            </div>
          </Context.Trigger>

          <Context.Content>
            <Context.Item
              onClick={() =>
                changeCreateRequestModalVisibility(collection.request_id)
              }
            >
              Create request
            </Context.Item>
            <Context.Item
              onClick={() =>
                changeCreateFolderModalVisibility(collection.request_id)
              }
            >
              Create folder
            </Context.Item>
          </Context.Content>
        </Context.Root>

        <div className="flex h-10 bg-blue-100 items-center justify-between px-4">
          <span className="text-sm">Environment</span>
          <CaretDown size={16} weight="bold" />
        </div>
      </div>
    </ResizableBox>
  )
}
