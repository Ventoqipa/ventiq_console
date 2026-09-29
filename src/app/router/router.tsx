import { createBrowserRouter } from 'react-router-dom'
import { AdminShell } from '../../presentation/components/AdminShell'
import { FoundationPage } from '../../presentation/pages/FoundationPage'
import { CustomerListPage } from '../../presentation/pages/customer/CustomerListPage'
import { LoginPage } from '../../presentation/pages/LoginPage'

const handleLogout = () => {
  // Limpiamos tokens o sesión guardada
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  // Redirigimos al Login
  window.location.href = '/login'
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage onLoginSuccess={() => (window.location.href = '/')} />,
  },
  {
    path: '/',
    element: <AdminShell onLogout={handleLogout} />,
    children: [
      {
        path: '/',
        element: <FoundationPage />,
      },
      {
        path: '/customers',
        element: <CustomerListPage />,
      },
    ],
  },
])
