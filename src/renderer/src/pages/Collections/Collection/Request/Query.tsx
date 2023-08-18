import { Controller, useFieldArray } from 'react-hook-form'

import { Button } from '@/components/Button'
import { IconButton } from '@/components/IconButton'
import { Tabs } from '@/components/Tabs'
import { TextInput } from '@/components/TextInput'
import { Check, Trash, Square } from '@phosphor-icons/react'

export function Query() {
  const { fields, append, remove } = useFieldArray({
    name: 'query',
  })

  return (
    <Tabs.Content value="query">
      <div className="flex-1 flex flex-col p-4 gap-4">
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => {
              append({
                active: true,
                name: '',
                value: '',
              })
            }}
          >
            + Header
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-end">
              <Controller
                name={`query.${index}.active`}
                render={({ field: activeField }) => (
                  <IconButton
                    type="button"
                    onClick={() => activeField.onChange(!activeField.value)}
                  >
                    {activeField.value ? (
                      <Check size={16} />
                    ) : (
                      <Square size={16} />
                    )}
                  </IconButton>
                )}
              />

              <div className="flex-1">
                <TextInput name={`query.${index}.name`} placeholder="Name" />
              </div>

              <div className="flex-1">
                <TextInput name={`query.${index}.value`} placeholder="Value" />
              </div>

              <IconButton type="button" onClick={() => remove(index)}>
                <Trash weight="bold" />
              </IconButton>
            </div>
          ))}
        </div>
      </div>
    </Tabs.Content>
  )
}
