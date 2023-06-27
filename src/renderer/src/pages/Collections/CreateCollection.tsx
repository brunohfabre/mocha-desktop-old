import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'

import { Button } from '../../components/Button'
import { TextInput } from '../../components/TextInput'
import { api } from '../../lib/api'
import { useProjectStore } from '../../stores/projectStore'

const createCollectionFormSchema = z.object({
  name: z.string().nonempty(),
})

type CreateCollectionFormData = z.infer<typeof createCollectionFormSchema>

export function CreateCollection() {
  const navigate = useNavigate()

  const project = useProjectStore((state) => state.project)

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

      const response = await api.post(`/projects/${project?.id}/collections`, {
        name,
      })

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
    <div className="flex-1 flex flex-col gap-4">
      <header className="p-4">
        <h1 className="font-medium">New organization</h1>
      </header>

      <FormProvider {...createCollectionForm}>
        <form
          onSubmit={handleSubmit(createCollection)}
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
