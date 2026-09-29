import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../../presentation/layout/AppShell'
import { FoundationPage } from '../../presentation/pages/FoundationPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [{ index: true, element: <FoundationPage /> }],
  },
])
