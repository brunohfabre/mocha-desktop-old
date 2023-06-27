import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'

import { Button } from '../../components/Button'
import { TextInput } from '../../components/TextInput'
import { api } from '../../lib/api'
import { useProjectStore } from '../../stores/projectStore'

const createProjectSchema = z.object({
  name: z.string().nonempty(),
})

type CreateProjectData = z.infer<typeof createProjectSchema>

export function CreateProject() {
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()

  const queryClient = useQueryClient()

  const selectProject = useProjectStore((state) => state.selectProject)

  const createProjectForm = useForm<CreateProjectData>({
    resolver: zodResolver(createProjectSchema),
  })
  const { handleSubmit } = createProjectForm

  const [loading, setLoading] = useState(false)

  async function createProject(data: CreateProjectData) {
    try {
      setLoading(true)

      const { name } = data

      const response = await api.post(`/projects`, {
        name,
        organizationId: id,
      })

      selectProject(response.data.project)

      queryClient.setQueryData(['organizations'], (prevState: any) =>
        prevState.map((organization: any) =>
          organization.id === response.data.project.organization_id
            ? {
                ...organization,
                projects: [...organization.projects, response.data.project],
              }
            : organization,
        ),
      )

      navigate('/', {
        replace: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col gap-4">
      <header className="p-4">
        <h1 className="font-medium">New project</h1>
      </header>

      <FormProvider {...createProjectForm}>
        <form
          onSubmit={handleSubmit(createProject)}
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
