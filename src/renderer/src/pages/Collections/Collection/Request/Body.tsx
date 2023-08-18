import { useController } from 'react-hook-form'

import { Button } from '@/components/Button'
import { Dropdown } from '@/components/Dropdown'
import { Tabs } from '@/components/Tabs'
import { json } from '@codemirror/lang-json'
import { CaretDown } from '@phosphor-icons/react'
import CodeMirror from '@uiw/react-codemirror'

export function Body() {
  const { field: typeField } = useController({
    name: 'bodyType',
  })
  const { field } = useController({
    name: 'body',
  })

  return (
    <Tabs.Content value="body">
      <div className="flex-1 flex flex-col relative">
        {typeField.value === 'JSON' && (
          <CodeMirror
            value={field.value ?? ''}
            extensions={[json()]}
            onChange={field.onChange}
            className="flex-1 flex overflow-auto"
          />
        )}

        <div className="absolute bottom-4 right-[30px]">
          <Dropdown.Root>
            <Dropdown.Trigger>
              <Button type="button">
                {typeField.value} <CaretDown className="ml-2" />
              </Button>
            </Dropdown.Trigger>

            <Dropdown.Content align="end">
              <Dropdown.Item
                onClick={() => {
                  typeField.onChange('NONE')
                  field.onChange('')
                }}
              >
                NONE
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  typeField.onChange('JSON')
                  field.onChange('')
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
