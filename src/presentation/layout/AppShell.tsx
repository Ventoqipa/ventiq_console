import { NavLink, Outlet } from 'react-router-dom'

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/">Ventiq</a>
        <nav aria-label="Primary navigation">
          <NavLink to="/admin">Admin</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </nav>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
