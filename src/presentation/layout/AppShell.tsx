import { Outlet } from 'react-router-dom'

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/">Ventiq Console</a>
        <span>Ventoqipa Internal Administration</span>
      </header>
      <main className="content"><Outlet /></main>
    </div>
  )
}
