import { useNavigate } from 'react-router-dom'

import { CaretRight } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'

import { Button } from '../../components/Button'
import { Empty } from '../../components/Empty'
import { IconButton } from '../../components/IconButton'
import { api } from '../../lib/api'
import { ProjectCard } from './ProjectCard'

type ProjectType = {
  id: string
  name: string
  organization_id: string
}

type OrganizationType = {
  id: string
  name: string
  type: string
  created_at: string
  projects: ProjectType[]
}

export function Organizations() {
  const navigate = useNavigate()

  const { data: organizations, isLoading: isOrganizationsLoading } = useQuery<
    OrganizationType[]
  >(['organizations'], async () => {
    const response = await api.get('/projects')

    return response.data.organizations
  })

  if (!organizations && isOrganizationsLoading) {
    return (
      <div className="flex flex-col p-4 gap-4">
        <div className="flex justify-between items-center">
          <div className="bg-zinc-200 h-4 w-24 animate-pulse" />

          <div className="bg-zinc-200 h-8 w-32 animate-pulse" />
        </div>

        {new Array(2).fill('').map((_, index) => (
          <div key={String(index)} className="flex flex-col gap-2">
            <div className="bg-zinc-200 h-4 w-24 animate-pulse" />

            <div className="bg-zinc-200 h-32 w-full animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="flex justify-between items-center p-4">
        <h1 className="font-medium">Organizations</h1>

        <Button onClick={() => navigate('/organizations/create')}>
          + New organization
        </Button>
      </div>

      <div className="flex-1 overflow-auto px-4 pb-4 flex flex-col gap-8">
        {organizations?.map((organization) => (
          <div key={organization.id} className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <p>{organization.name}</p>

              <IconButton
                type="button"
                size="sm"
                onClick={() => navigate(`/organizations/${organization.id}`)}
              >
                <CaretRight size={14} weight="bold" />
              </IconButton>
            </div>

            {organization.projects.length ? (
              <>
                <div className="grid grid-cols-4 gap-2">
                  {organization.projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}

                  <Button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/organizations/${organization.id}/projects/create`,
                      )
                    }
                  >
                    + New project
                  </Button>
                </div>
              </>
            ) : (
              <Empty
                title="No projects"
                description="Get started by creating a new project."
                actionText="+ New project"
                onAction={() =>
                  navigate(`/organizations/${organization.id}/projects/create`)
                }
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
