import { useFormContext, useFieldArray, Controller } from 'react-hook-form'

import { Check, Trash } from '@phosphor-icons/react'

import { Button } from '../../../../components/Button'
import { IconButton } from '../../../../components/IconButton'
import { Tabs } from '../../../../components/Tabs'
import { TextInput } from '../../../../components/TextInput'

export function Headers() {
  const { control } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    name: 'headers',
    control,
  })

  return (
    <Tabs.Content value="headers">
      <div className="flex-1 flex flex-col p-4 gap-4">
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() =>
              append({
                name: '',
                value: '',
                active: false,
              })
            }
          >
            + Header
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-end">
              <Controller
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
