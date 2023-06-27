import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useQueryClient } from '@tanstack/react-query'

import { Alert } from '../../components/Alert'
import { Context } from '../../components/Context'
import { api } from '../../lib/api'
import { useProjectStore } from '../../stores/projectStore'

type ProjectType = {
  id: string
  name: string
  organization_id: string
}

interface ProjectCardProps {
  project: ProjectType
}

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate()

  const selectProject = useProjectStore((state) => state.selectProject)

  const queryClient = useQueryClient()

  const [loading, setLoading] = useState(false)
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false)

  function handleSelectProject(project: ProjectType) {
    selectProject(project)

    navigate('/')
  }

  async function hadleDeleteProject() {
    try {
      setLoading(true)

      await api.delete(`/projects/${project.id}`)

      queryClient.setQueriesData(['organizations'], (prevState: any) =>
        prevState.map((organization: any) =>
          organization.id === project.organization_id
            ? {
                ...organization,
                projects: organization.projects.filter(
                  (item: ProjectType) => item.id !== project.id,
                ),
              }
            : organization,
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Alert
        open={deleteAlertVisible}
        onOpenChange={setDeleteAlertVisible}
        title="Delete project"
        description="Really want to delete this project?"
        actionText="Yes, delete"
        onAction={hadleDeleteProject}
        isLoading={loading}
      />

      <Context.Root key={project.id}>
        <Context.Trigger>
          <div
            className="h-32 bg-zinc-100 p-4 hover:bg-zinc-200 cursor-pointer"
            onClick={() => handleSelectProject(project)}
          >
            {project.name}
          </div>
        </Context.Trigger>

        <Context.Content>
          <Context.Item onClick={() => setDeleteAlertVisible(true)}>
            Delete
          </Context.Item>
        </Context.Content>
      </Context.Root>
    </>
  )
}
