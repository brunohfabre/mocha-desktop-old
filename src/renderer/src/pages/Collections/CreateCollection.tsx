import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { z } from 'zod'

import { IconButton } from '@/components/IconButton'
import { zodResolver } from '@hookform/resolvers/zod'
import { CaretLeft } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'

import { Button } from '../../components/Button'
import { TextInput } from '../../components/TextInput'
import { api } from '../../lib/api'
import { useOrganizationStore } from '../../stores/organizationStore'

const createCollectionFormSchema = z.object({
  name: z.string().nonempty(),
})

type CreateCollectionFormData = z.infer<typeof createCollectionFormSchema>

export function CreateCollection() {
  const navigate = useNavigate()

  const organization = useOrganizationStore((state) => state.organization)

  const queryClient = useQueryClient()

  const createCollectionForm = useForm<CreateCollectionFormData>({
    resolver: zodResolver(createCollectionFormSchema),
  })
  const { handleSubmit } = createCollectionForm

  const [loading, setLoading] = useState(false)

  async function createCollection(data: CreateCollectionFormData) {
    try {
      setLoading(true)

      const { name } = data

      const response = await api.post(
        `/organizations/${organization?.id}/collections`,
        {
          name,
        },
      )

      queryClient.setQueryData(['collections'], (prevState: any) => [
        ...prevState,
        response.data.collection,
      ])

      navigate(`/collections/${response.data.collection.id}`, {
        replace: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex">
      <div className="flex-1 flex flex-col max-w-xl mx-auto p-4 gap-4">
        <div>
          <IconButton size="sm" onClick={() => navigate(-1)}>
            <CaretLeft weight="bold" />
          </IconButton>
        </div>
        <header>
          <h1 className="font-medium">New collection</h1>
        </header>

        <FormProvider {...createCollectionForm}>
          <form
            onSubmit={handleSubmit(createCollection)}
            className="w-full flex flex-col gap-8 self-center"
          >
            <TextInput name="name" label="Name" placeholder="Name" />

            <div className="flex justify-end">
              <Button isLoading={loading}>Create</Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
