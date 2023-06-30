import { Link, useNavigate } from 'react-router-dom'

export function Sidebar() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col w-60 bg-zinc-100">
      <header
        className="h-12 flex items-center px-4 text-sm cursor-pointer"
        onClick={() => navigate('/')}
      >
        Mocha
      </header>

      <div className="flex-1 flex flex-col">
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
