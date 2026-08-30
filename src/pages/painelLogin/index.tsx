import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { AuthPanel } from '@/components/painelLogin'

export default function MainPanelLogin() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <AuthPanel />
}
