import { Navigate } from 'react-router-dom'

import { useProjectStore } from '../stores/projectStore'

export function Home() {
  const project = useProjectStore((state) => state.project)

  if (!project) {
    return <Navigate to="/organizations" replace />
  }

  return (
    <div className="p-4">
      <h1>Home</h1>
    </div>
  )
}
