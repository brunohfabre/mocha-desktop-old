import { useEffect, useState } from 'react'

import { Button } from '@/components/Button'
import { IconButton } from '@/components/IconButton'
import { Tabs } from '@/components/Tabs'
import { Check, Trash } from '@phosphor-icons/react'

import { RequestType } from '../atoms'

type HeaderType = {
  id: string
  active: boolean
  name: string
  value: string
}

interface HeadersProps {
  request: RequestType
  onChangeData: (data: Record<string, any>) => void
}

export function Headers({ request, onChangeData }: HeadersProps) {
  const [headers, setHeaders] = useState<HeaderType[]>([])

  useEffect(() => {
    setHeaders(
      request.headers?.map((item) => ({ ...item, id: crypto.randomUUID() })),
    )
  }, [request])

  return (
    <Tabs.Content value="headers">
      <div className="flex-1 flex flex-col p-4 gap-4">
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => {
              const value = [
                ...headers,
                {
                  id: crypto.randomUUID(),
                  active: true,
                  name: '',
                  value: '',
                },
              ]

              setHeaders(value)

              onChangeData({
                headers: value,
              })
            }}
          >
            + Header
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          {headers.map((header, index) => (
            <div key={header.id} className="flex gap-2 items-end">
              <button
                type="button"
                className="w-10 h-10 bg-blue-200 flex items-center justify-center"
                onClick={() => {
                  const newHeaders = headers.map((item) =>
                    item.id === header.id
                      ? { ...item, active: !item.active }
                      : item,
                  )

                  setHeaders(newHeaders)
                  onChangeData({
                    headers: newHeaders,
                  })
                }}
              >
                {header.active && <Check size={16} />}
              </button>

              <input
                type="text"
                placeholder="Name"
                className="flex-1 min-w-[64px] h-10 bg-red-200 px-4"
                value={header.name}
                onChange={(event) => {
                  const value = event.target.value

                  const newHeaders = headers.map((item) =>
                    item.id === header.id ? { ...item, name: value } : item,
                  )

                  setHeaders(newHeaders)
                  onChangeData({
                    headers: newHeaders,
                  })
                }}
              />

              <input
                type="text"
                placeholder="Value"
                className="flex-1 min-w-[64px] h-10 bg-red-200 px-4"
                value={header.value}
                onChange={(event) => {
                  const value = event.target.value

                  const newHeaders = headers.map((item) =>
                    item.id === header.id ? { ...item, value } : item,
                  )

                  setHeaders(newHeaders)
                  onChangeData({
                    headers: newHeaders,
                  })
                }}
              />

              <IconButton
                type="button"
                onClick={() =>
                  setHeaders((prevState) =>
                    prevState.filter((item) => item.id !== header.id),
                  )
                }
              >
                <Trash weight="bold" />
              </IconButton>
            </div>
          ))}
        </div>
      </div>
    </Tabs.Content>
  )
}
