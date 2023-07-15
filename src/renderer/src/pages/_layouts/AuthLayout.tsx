import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export function AuthLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    window.api.onOauthToken((_: any, { token }: { token: string }) => {
      navigate('/oauth', {
        state: {
          token,
        },
      })
    })
  }, [navigate])

  return (
    <div className="flex-1 flex flex-col">
      <Outlet />
    </div>
  )
}
