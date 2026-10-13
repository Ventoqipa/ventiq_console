import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AdminShell } from '../../presentation/components/AdminShell'
import { FoundationPage } from '../../presentation/pages/FoundationPage'
import { CustomerDetailPage } from '../../presentation/pages/customer/CustomerDetailPage'
import { CustomerListPage } from '../../presentation/pages/customer/CustomerListPage'
import { LoginPage } from '../../presentation/pages/LoginPage'

const handleLogout = () => {
  localStorage.removeItem('ventiq_auth_token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

const isAuthenticated = () => {
  return Boolean(localStorage.getItem('ventiq_auth_token') || localStorage.getItem('user'))
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
      {
        path: 'customers/:id',
        element: <CustomerDetailPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
])