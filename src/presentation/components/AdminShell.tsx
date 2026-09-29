import React from 'react'

interface AdminShellProps {
  children: React.ReactNode
  onLogout?: () => void
}

export const AdminShell: React.FC<AdminShellProps> = ({ children, onLogout }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar Navigation */}
      <aside style={{ width: '240px', background: '#1e293b', color: '#fff', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Ventiq Console</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '1rem' }}>
              <a href="#customers" style={{ color: '#93c5fd', textDecoration: 'none' }}>
                Customers
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: '1rem 2rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Ventoqipa Admin Shell</span>
          {onLogout && (
            <button onClick={onLogout} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
              Logout
            </button>
          )}
        </header>
        <main style={{ padding: '2rem', flex: 1, background: '#f1f5f9' }}>
          {children}
        </main>
      </div>
    </div>
  )
}