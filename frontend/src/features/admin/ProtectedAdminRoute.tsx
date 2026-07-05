import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

export function ProtectedAdminRoute() {
  const token = useAuthStore((state) => state.accessToken)

  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}

