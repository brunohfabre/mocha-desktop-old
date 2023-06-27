import { useFormContext, useFieldArray } from 'react-hook-form'

import { Trash } from '@phosphor-icons/react'

import { Button } from '../../../../components/Button'
import { IconButton } from '../../../../components/IconButton'
import { Tabs } from '../../../../components/Tabs'
import { TextInput } from '../../../../components/TextInput'

export function Query() {
  const { control } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    name: 'query',
    control,
  })

  return (
    <Tabs.Content value="query">
      <div className="flex-1 flex flex-col p-4 gap-4">
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() =>
              append({
                name: '',
                value: '',
              })
            }
          >
            + Query
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-end">
              <div className="flex-1">
                <TextInput
                  name={`query.${index}.name`}
                  label="Name"
                  placeholder="Name"
                />
              </div>
              <div className="flex-1">
                <TextInput
                  name={`query.${index}.value`}
                  label="Value"
                  placeholder="Value"
                />
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
