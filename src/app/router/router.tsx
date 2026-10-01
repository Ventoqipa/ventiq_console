import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AdminShell } from '../../presentation/components/AdminShell'
import { FoundationPage } from '../../presentation/pages/FoundationPage'
import { CustomerDetailPage } from '../../presentation/pages/customer/CustomerDetailPage'
import { CustomerListPage } from '../../presentation/pages/customer/CustomerListPage'
import { LoginPage } from '../../presentation/pages/LoginPage'

const handleLogout = () => {
  // Limpiamos tokens o sesión guardada
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  // Redirigimos al Login
  window.location.href = '/login'
}

// Función auxiliar simple para verificar si hay sesión activa
const isAuthenticated = () => {
  return Boolean(localStorage.getItem('token') || localStorage.getItem('user'))
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage onLoginSuccess={() => (window.location.href = '/')} />,
  },
  {
    path: '/',
    element: isAuthenticated() ? (
      <AdminShell onLogout={handleLogout} />
    ) : (
      <Navigate to="/login" replace />
    ),
    children: [
      {
        index: true,
        element: <FoundationPage />,
      },
      {
        path: 'customers',
        element: <CustomerListPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
  {
  path: 'customers/:id',
  element: <CustomerDetailPage />,
}
])
