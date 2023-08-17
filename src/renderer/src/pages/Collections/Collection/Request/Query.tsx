import { useEffect, useState } from 'react'

import { Button } from '@/components/Button'
import { IconButton } from '@/components/IconButton'
import { Tabs } from '@/components/Tabs'
import { Check, Trash } from '@phosphor-icons/react'

import { RequestType } from '../atoms'

type QueryType = {
  id: string
  active: boolean
  name: string
  value: string
}

interface QueryProps {
  request: RequestType
  onChangeData: (data: Record<string, any>) => void
}

export function Query({ request, onChangeData }: QueryProps) {
  const [query, setQuery] = useState<QueryType[]>([])

  useEffect(() => {
    console.log(request)
    setQuery(
      request.query?.map((item) => ({ ...item, id: crypto.randomUUID() })),
    )
  }, [request])

  return (
    <Tabs.Content value="query">
      <div className="flex-1 flex flex-col p-4 gap-4">
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => {
              const value = [
                ...query,
                {
                  id: crypto.randomUUID(),
                  active: true,
                  name: '',
                  value: '',
                },
              ]

              setQuery(value)

              onChangeData({
                query: value,
              })
            }}
          >
            + Query
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          {query.map((item, index) => (
            <div key={item.id} className="flex gap-2 items-end">
              <button
                type="button"
                className="w-10 h-10 bg-blue-200 flex items-center justify-center"
                onClick={() => {
                  const newQueries = query.map((queryItem) =>
                    queryItem.id === item.id
                      ? { ...queryItem, active: !queryItem.active }
                      : queryItem,
                  )

                  setQuery(newQueries)
                  onChangeData({
                    query: newQueries,
                  })
                }}
              >
                {item.active && <Check size={16} />}
              </button>

              <input
                type="text"
                placeholder="Name"
                className="flex-1 min-w-[64px] h-10 bg-red-200 px-4"
                value={item.name}
                onChange={(event) => {
                  const value = event.target.value

                  const newQueries = query.map((queryItem) =>
                    queryItem.id === item.id
                      ? { ...queryItem, name: value }
                      : queryItem,
                  )

                  setQuery(newQueries)
                  onChangeData({
                    query: newQueries,
                  })
                }}
              />

              <input
                type="text"
                placeholder="Value"
                className="flex-1 min-w-[64px] h-10 bg-red-200 px-4"
                value={item.value}
                onChange={(event) => {
                  const value = event.target.value

                  const newQueries = query.map((queryItem) =>
                    queryItem.id === item.id
                      ? { ...queryItem, value }
                      : queryItem,
                  )

                  setQuery(newQueries)
                  onChangeData({
                    query: newQueries,
                  })
                }}
              />

              <IconButton
                type="button"
                onClick={() =>
                  setQuery((prevState) =>
                    prevState.filter((queryItem) => queryItem.id !== item.id),
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
