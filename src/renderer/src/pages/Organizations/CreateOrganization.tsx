import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'

import { Button } from '../../components/Button'
import { TextInput } from '../../components/TextInput'
import { api } from '../../lib/api'

const createOrganizationSchema = z.object({
  name: z.string().nonempty(),
})

type CreateOrganizationData = z.infer<typeof createOrganizationSchema>

export function CreateOrganization() {
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const createOrganizationForm = useForm<CreateOrganizationData>({
    resolver: zodResolver(createOrganizationSchema),
  })
  const { handleSubmit } = createOrganizationForm

  const [loading, setLoading] = useState(false)

  async function createOrganization(data: CreateOrganizationData) {
    try {
      setLoading(true)

      const { name } = data

      const response = await api.post('/organizations', {
        name,
      })

      queryClient.setQueryData(['organizations'], (prevState: any) => [
        ...prevState,
        response.data.organization,
      ])

      navigate(-1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col gap-4">
      <header className="p-4">
        <h1 className="font-medium">New organization</h1>
      </header>

      <FormProvider {...createOrganizationForm}>
        <form
          onSubmit={handleSubmit(createOrganization)}
          className="max-w-md w-full flex flex-col gap-8 self-center"
        >
          <TextInput name="name" label="Name" placeholder="Name" />

          <div className="flex justify-end">
            <Button isLoading={loading}>Create</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
