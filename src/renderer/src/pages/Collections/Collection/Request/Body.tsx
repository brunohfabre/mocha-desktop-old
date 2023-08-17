import { useEffect, useState } from 'react'

import { Button } from '@/components/Button'
import { Dropdown } from '@/components/Dropdown'
import { Tabs } from '@/components/Tabs'
import { json } from '@codemirror/lang-json'
import { CaretDown } from '@phosphor-icons/react'
import CodeMirror from '@uiw/react-codemirror'

import { RequestType } from '../atoms'

interface BodyProps {
  request: RequestType
  onChangeData: (data: Record<string, any>) => void
}

export function Body({ request, onChangeData }: BodyProps) {
  const [bodyType, setBodyType] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    setBodyType(request.bodyType ?? 'NONE')
    setBody(request.body ?? '')
  }, [request])

  return (
    <Tabs.Content value="body">
      <div className="flex-1 flex flex-col relative">
        {bodyType === 'JSON' && (
          <CodeMirror
            value={body}
            extensions={[json()]}
            onChange={(value) => {
              onChangeData({
                body: value,
              })

              setBody(value)
            }}
            className="flex-1 flex overflow-auto"
          />
        )}

        <div className="absolute bottom-4 right-[30px]">
          <Dropdown.Root>
            <Dropdown.Trigger>
              <Button type="button">
                {bodyType} <CaretDown className="ml-2" />
              </Button>
            </Dropdown.Trigger>

            <Dropdown.Content align="end">
              <Dropdown.Item
                onClick={() => {
                  onChangeData({
                    bodyType: 'NONE',
                    body: '',
                  })

                  setBodyType('NONE')
                }}
              >
                NONE
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  onChangeData({
                    bodyType: 'JSON',
                    body: '',
                  })

                  setBodyType('JSON')
                }}
              >
                JSON
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        </div>
      </div>
    </Tabs.Content>
  )
}
