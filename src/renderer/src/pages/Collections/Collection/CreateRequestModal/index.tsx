import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'

import { Button } from '../../../../components/Button'
import { Modal } from '../../../../components/Modal'
import { TextInput } from '../../../../components/TextInput'
import { api } from '../../../../lib/api'
import { useRequestStore } from '../stores/requestStore'
import { useCreateRequestModalStore } from './createRequestModalStore'

const createRequestFormSchema = z.object({
  name: z.string().nonempty(),
})

type CreateRequestFormData = z.infer<typeof createRequestFormSchema>

export function CreateRequestModal() {
  const queryClient = useQueryClient()

  const { collectionId } = useParams<{ collectionId: string }>()

  const createRequestForm = useForm<CreateRequestFormData>({
    resolver: zodResolver(createRequestFormSchema),
  })
  const { handleSubmit, reset } = createRequestForm

  const visible = useCreateRequestModalStore((state) => state.visible)
  const changeVisibility = useCreateRequestModalStore(
    (state) => state.changeVisibility,
  )
  const selectRequest = useRequestStore((state) => state.selectRequest)

  const [loading, setLoading] = useState(false)

  function handleCloseModal() {
    changeVisibility('')
    reset()
  }

  async function createRequest(data: CreateRequestFormData) {
    try {
      setLoading(true)

      const { name } = data

      const response = await api.post('/requests', {
        name,
        type: 'REQUEST',
        parentId: visible,
        method: 'GET',
      })

      queryClient.setQueryData(
        ['collections', collectionId],
        (prevState: any) => ({
          ...prevState,
          requests: [...prevState.requests, response.data.request],
        }),
      )

      handleCloseModal()
      selectRequest(response.data.request)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={!!visible}
      onOpenChange={handleCloseModal}
      title="Create request"
    >
      <FormProvider {...createRequestForm}>
        <form
          onSubmit={handleSubmit(createRequest)}
          className="flex flex-col gap-4"
        >
          <TextInput name="name" label="Name" placeholder="Name" autoFocus />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button isLoading={loading}>Create</Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  )
}
