import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminShell } from '../../presentation/components/AdminShell'
import { LoginPage } from '../../presentation/pages/LoginPage'

const isAuthenticated = () => {
  return Boolean(localStorage.getItem('ventiq_auth_token') || localStorage.getItem('user'))
}

// Recreamos la estructura de guard de rutas limpia para la prueba de entorno jsdom
const TestApp = () => (
  <Routes>
    <Route path="/login" element={<LoginPage onLoginSuccess={() => {}} />} />
    <Route
      path="/"
      element={
        isAuthenticated() ? (
          <AdminShell onLogout={() => {}} />
        ) : (
          <Navigate to="/login" replace />
        )
      }
    >
      <Route path="customers" element={<div>Customer List Page</div>} />
      <Route path="customers/:id" element={<div>Customer Detail Page</div>} />
    </Route>
  </Routes>
)

describe('Router Configuration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('redirects unauthenticated users from protected routes to /login', () => {
    render(
      <MemoryRouter initialEntries={['/customers']}>
        <TestApp />
      </MemoryRouter>
    )

    expect(screen.getByText('Ventiq Console')).toBeInTheDocument()
    expect(
      screen.getByText('Enter your credentials to access the console')
    ).toBeInTheDocument()
  })

  it('allows access to protected customer detail route when authenticated', () => {
    localStorage.setItem('ventiq_auth_token', 'mock-valid-token')

    render(
      <MemoryRouter initialEntries={['/customers/cust-123']}>
        <TestApp />
      </MemoryRouter>
    )

    expect(screen.getByText('Customer Detail Page')).toBeInTheDocument()
  })
})