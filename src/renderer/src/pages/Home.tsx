import { useNavigate } from 'react-router-dom'

export function Home() {
  const navigate = useNavigate()

  return (
    <div className="flex-1 flex items-center justify-center gap-4">
      <button
        type="button"
        className="bg-zinc-100 h-80 w-60 hover:bg-zinc-200"
        onClick={() => navigate('/collections')}
      >
        Collections
      </button>

      <button
        type="button"
        className="bg-zinc-100 h-80 w-60 hover:enabled:bg-zinc-200 disabled:opacity-60 disabled:cursor-not-allowed"
        disabled
      >
        Notes
      </button>

      <button
        type="button"
        className="bg-zinc-100 h-80 w-60 hover:enabled:bg-zinc-200 disabled:opacity-60 disabled:cursor-not-allowed"
        disabled
      >
        Databases
      </button>
    </div>
  )
}
