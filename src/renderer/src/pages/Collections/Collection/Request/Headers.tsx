import { useState } from 'react'

import { Button } from '@/components/Button'
import { IconButton } from '@/components/IconButton'
import { Tabs } from '@/components/Tabs'
import { TextInput } from '@/components/TextInput'
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

  return (
    <Tabs.Content value="headers">
      <div className="flex-1 flex flex-col p-4 gap-4">
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() =>
              setHeaders((prevState) => [
                ...prevState,
                {
                  id: crypto.randomUUID(),
                  active: true,
                  name: '',
                  value: '',
                },
              ])
            }
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
                onClick={() =>
                  setHeaders((prevState) =>
                    prevState.map((item) =>
                      item.id === header.id
                        ? { ...item, active: !item.active }
                        : item,
                    ),
                  )
                }
              >
                {header.active && <Check size={16} />}
              </button>

              <input
                type="text"
                placeholder="Name"
                className="flex-1 h-10 bg-red-200 px-4"
              />
              <input
                type="text"
                placeholder="Value"
                className="flex-1 h-10 bg-red-200 px-4"
              />
              {/* <Controller
                name={`headers.${index}.active`}
                render={({ field }) => (
                  <button
                    type="button"
                    className="h-10 w-10 bg-blue-200 flex items-center justify-center"
                    onClick={() => field.onChange(!field.value)}
                  >
                    {field.value && <Check size={18} weight="bold" />}
                  </button>
                )}
              />
              <div className="flex-1">
                <TextInput
                  name={`headers.${index}.name`}
                  label="Name"
                  placeholder="Name"
                />
              </div>
              <div className="flex-1">
                <TextInput
                  name={`headers.${index}.value`}
                  label="Value"
                  placeholder="Value"
                />
              </div> */}
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
