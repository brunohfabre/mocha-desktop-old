import { useFormContext, useController } from 'react-hook-form'

import { CaretDown } from '@phosphor-icons/react'

import { Button } from '../../../../components/Button'
import { Dropdown } from '../../../../components/Dropdown'
import { Tabs } from '../../../../components/Tabs'
import { TextInput } from '../../../../components/TextInput'

export function Auth() {
  const { control } = useFormContext()

  const { field: typeField } = useController({
    name: 'authType',
    control,
  })

  return (
    <Tabs.Content value="auth">
      <div className="flex-1 flex flex-col relative">
        {typeField.value === 'BASIC' && (
          <div className="flex flex-col gap-2 p-4">
            <TextInput
              name="auth.username"
              label="Username"
              placeholder="Username"
            />
            <TextInput
              name="auth.password"
              label="Password"
              placeholder="Password"
            />
          </div>
        )}
        {typeField.value === 'BEARER' && (
          <div className="p-4">
            <TextInput name="auth.token" label="Token" placeholder="Token" />
          </div>
        )}

        <div className="absolute bottom-4 right-[30px]">
          <Dropdown.Root>
            <Dropdown.Trigger>
              <Button type="button">
                {typeField.value} <CaretDown className="ml-2" />
              </Button>
            </Dropdown.Trigger>

            <Dropdown.Content align="end">
              <Dropdown.Item onClick={() => typeField.onChange('NONE')}>
                NONE
              </Dropdown.Item>
              <Dropdown.Item onClick={() => typeField.onChange('BASIC')}>
                BASIC
              </Dropdown.Item>
              <Dropdown.Item onClick={() => typeField.onChange('BEARER')}>
                BEARER
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        </div>
      </div>
    </Tabs.Content>
  )
}
