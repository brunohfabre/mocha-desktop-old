import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuthStore } from '../stores/authStore'

export function Protected() {
  const location = useLocation()

  const token = useAuthStore((state) => state.token)

  if (!token) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />
  }

  return <Outlet />
}
