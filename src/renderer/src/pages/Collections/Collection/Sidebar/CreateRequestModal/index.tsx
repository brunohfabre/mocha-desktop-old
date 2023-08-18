import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import { useAtom } from 'jotai'
import { z } from 'zod'

import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { TextInput } from '@/components/TextInput'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'

import { collectionAtom } from '../../atoms'
import { createRequestModalVisibleAtom } from './atoms'

const createRequestFormSchema = z.object({
  name: z.string().nonempty(),
})

type CreateRequestFormData = z.infer<typeof createRequestFormSchema>

export function CreateRequestModal() {
  const navigate = useNavigate()
  const { collectionId } = useParams<{ collectionId: string }>()

  const createRequestForm = useForm<CreateRequestFormData>({
    resolver: zodResolver(createRequestFormSchema),
  })
  const { handleSubmit, reset } = createRequestForm

  const [, setCollection] = useAtom(collectionAtom)
  const [visible, setVisible] = useAtom(createRequestModalVisibleAtom)

  const [loading, setLoading] = useState(false)

  function handleCloseModal() {
    setVisible('')
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

      setCollection((prevState: any) => ({
        ...prevState,
        requests: [...prevState.requests, response.data.request],
      }))

      navigate(`/collections/${collectionId}/${response.data.request.id}`)

      handleCloseModal()
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
