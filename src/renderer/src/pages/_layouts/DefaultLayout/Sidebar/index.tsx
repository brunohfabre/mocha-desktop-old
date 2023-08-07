import { useLocation, useNavigate } from 'react-router-dom'

import clsx from 'clsx'

import LogoLight from '@/assets/logo-light.svg'

import { Avatar } from './Avatar'
import { Organizations } from './Organizations'

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="flex flex-col w-14 bg-zinc-100 border-r border-red-500">
      <button
        type="button"
        className="w-14 h-14 flex items-center justify-center"
        onClick={() => navigate('/')}
      >
        <img src={LogoLight} alt="Mocha" className="h-6" />
      </button>

      <Organizations />

      <div className="flex-1 flex flex-col">
        <button
          type="button"
          className="flex h-12 w-14 items-center justify-center hover:bg-zinc-200"
          onClick={() => navigate('/collections')}
        >
          <span
            className={clsx(
              'font-semibold text-base text-zinc-500',
              location.pathname === '/collections' && 'text-zinc-900',
            )}
          >
            C
          </span>
        </button>
        <button
          type="button"
          className="flex h-12 w-14 items-center justify-center hover:enabled:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled
        >
          <span
            className={clsx(
              'font-semibold text-base text-zinc-500',
              location.pathname === '/collections' && 'text-zinc-900',
            )}
          >
            N
          </span>
        </button>
        <button
          type="button"
          className="flex h-12 w-14 items-center justify-center hover:enabled:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled
        >
          <span
            className={clsx(
              'font-semibold text-base text-zinc-500',
              location.pathname === '/collections' && 'text-zinc-900',
            )}
          >
            D
          </span>
        </button>
      </div>

      <Avatar />
    </div>
  )
}
