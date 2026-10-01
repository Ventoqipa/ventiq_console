import React from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

interface AdminShellProps {
  userName?: string
  userEmail?: string
  onLogout?: () => void
}

export const AdminShell: React.FC<AdminShellProps> = ({
  userName = 'Admin User',
  userEmail = 'admin@ventiq.com',
  onLogout,
}) => {
  const location = useLocation()

  const getBreadcrumb = () => {
    if (location.pathname.includes('/customers')) return 'Customers'
    return 'Overview'
  }

  const navItems = [
    { label: 'Overview', path: '/' },
    { label: 'Customers', path: '/customers' },
  ]

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#f4f5f7',
      }}
    >
      {/* Sidebar con borde/sombreado de ancho completo */}
      <aside
        style={{
          width: '230px',
          backgroundColor: '#18181b',
          color: '#a1a1aa',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.25rem 0',
        }}
      >
        <div>
          {/* Header del Sidebar */}
          <div style={{ padding: '0.5rem 1.75rem 1.75rem 1.75rem' }}>
            <span
              style={{
                fontSize: '0.65rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#71717a',
                display: 'block',
                fontWeight: 600,
              }}
            >
              VENTIQ PLATFORM
            </span>
            <h1
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#ffffff',
                margin: '0.2rem 0 0 0',
              }}
            >
              Console
            </h1>
          </div>

          {/* Menú de Navegación de Ancho Completo */}
          <nav>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
              }}
            >
              {navItems.map((item) => (
                <li key={item.path} style={{ width: '100%' }}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '0.7rem 1.75rem',
                      borderRadius: '0px',
                      color: isActive ? '#ffffff' : '#a1a1aa',
                      backgroundColor: isActive ? '#27272a' : 'transparent',
                      borderLeft: isActive
                        ? '3px solid #3b82f6'
                        : '3px solid transparent',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 400,
                      transition: 'all 0.15s ease',
                    })}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Footer del Sidebar */}
        <div
          style={{
            padding: '0 1.75rem',
            fontSize: '0.725rem',
            color: '#52525b',
          }}
        >
          v0.1.0 · MVP
        </div>
      </aside>

      {/* Área Principal de Contenido */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <header
          style={{
            height: '52px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e4e4e7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.75rem',
          }}
        >
          <div style={{ fontSize: '0.825rem', color: '#71717a' }}>
            Ventiq Console /{' '}
            <span style={{ color: '#18181b', fontWeight: 600 }}>
              {getBreadcrumb()}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              fontSize: '0.825rem',
            }}
          >
            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  display: 'block',
                  fontWeight: 600,
                  color: '#18181b',
                  lineHeight: '1.2',
                }}
              >
                {userName}
              </span>
              <span
                style={{
                  fontSize: '0.725rem',
                  color: '#71717a',
                  display: 'block',
                }}
              >
                {userEmail}
              </span>
            </div>

          <button
            onClick={onLogout}
            style={{
                backgroundColor: '#18181b', // Fondo negro
                color: '#ffffff',          // Texto blanco
                border: 'none',
                borderRadius: '6px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
            }}
            >
            Logout
            </button>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main style={{ padding: '2rem 1.75rem', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}