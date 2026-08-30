import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import MainPanelLogin from '@/pages/painelLogin'
import MainPanelPrincipal from '@/pages/painelPrincipal'
import { ProtectedRoute } from './ProtectedRoute'

export function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<MainPanelLogin />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainPanelPrincipal />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
