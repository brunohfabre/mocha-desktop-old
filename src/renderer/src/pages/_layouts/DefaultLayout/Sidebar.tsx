import { Link, useNavigate } from 'react-router-dom'

import { CaretDown } from '@phosphor-icons/react'

import { useProjectStore } from '../../../stores/projectStore'

export function Sidebar() {
  const navigate = useNavigate()

  const project = useProjectStore((state) => state.project)

  return (
    <div className="flex flex-col w-60 bg-zinc-100">
      <header
        className="h-12 flex items-center justify-between px-4 text-sm hover:bg-zinc-200 cursor-pointer"
        onClick={() => navigate('/organizations')}
      >
        <span>{project?.name}</span>

        <CaretDown size={16} weight="bold" />
      </header>

      <div className="flex-1 flex flex-col">
        <Link className="h-10 hover:bg-zinc-200 flex items-center px-4" to="/">
          <span className="text-sm">Home</span>
        </Link>

        <Link
          className="h-10 hover:bg-zinc-200 flex items-center px-4"
          to="/collections"
        >
          <span className="text-sm">Collections</span>
        </Link>
      </div>
    </div>
  )
}
