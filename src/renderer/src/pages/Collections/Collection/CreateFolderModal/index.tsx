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
import { useCreateFolderModalStore } from './createFolderModalStore'

const createFolderFormSchema = z.object({
  name: z.string().nonempty(),
})

type CreateFolderFormData = z.infer<typeof createFolderFormSchema>

export function CreateFolderModal() {
  const queryClient = useQueryClient()

  const { collectionId } = useParams<{ collectionId: string }>()

  const createFolderForm = useForm<CreateFolderFormData>({
    resolver: zodResolver(createFolderFormSchema),
  })
  const { handleSubmit, reset } = createFolderForm

  const visible = useCreateFolderModalStore((state) => state.visible)
  const changeVisibility = useCreateFolderModalStore(
    (state) => state.changeVisibility,
  )

  const [loading, setLoading] = useState(false)

  function handleCloseModal() {
    changeVisibility('')
    reset()
  }

  async function createFolder(data: CreateFolderFormData) {
    try {
      setLoading(true)

      const { name } = data

      const response = await api.post('/requests', {
        name,
        type: 'FOLDER',
        parentId: visible,
      })

      queryClient.setQueryData(
        ['collections', collectionId],
        (prevState: any) => ({
          ...prevState,
          requests: [...prevState.requests, response.data.request],
        }),
      )

      handleCloseModal()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={!!visible}
      onOpenChange={handleCloseModal}
      title="Create folder"
    >
      <FormProvider {...createFolderForm}>
        <form
          onSubmit={handleSubmit(createFolder)}
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
