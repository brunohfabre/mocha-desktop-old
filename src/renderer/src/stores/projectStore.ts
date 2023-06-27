import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ProjectType = {
  id: string
  name: string
}

interface Store {
  project: ProjectType | null
  selectProject: (project: ProjectType | null) => void
}

export const useProjectStore = create(
  persist<Store>(
    (set) => ({
      project: null,
      selectProject: (project: ProjectType | null) =>
        set(() => ({
          project,
        })),
    }),
    {
      name: 'project',
    },
  ),
)
