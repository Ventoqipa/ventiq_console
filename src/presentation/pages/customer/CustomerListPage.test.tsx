import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { CustomerListPage } from './CustomerListPage'

// Mock de useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

describe('CustomerListPage Filtering & Search', () => {
  // Limpiar el DOM después de cada test para evitar componentes duplicados
  afterEach(() => {
    cleanup()
  })

  const getSearchInput = () =>
    screen.getByPlaceholderText(/search by company name or slug/i)

  const getStatusDropdown = () => screen.getByRole('combobox')

  // Función auxiliar para esperar a que termine el estado de carga inicial
  const waitForLoadingToFinish = async () => {
    const loadingElement = screen.queryByText(/loading customers\.\.\./i)
    if (loadingElement) {
      await waitForElementToBeRemoved(loadingElement)
    }
  }

  it('renders search input and status filter dropdown', async () => {
    render(
      <MemoryRouter>
        <CustomerListPage />
      </MemoryRouter>
    )

    await waitForLoadingToFinish()

    expect(getSearchInput()).toBeInTheDocument()
    expect(getStatusDropdown()).toBeInTheDocument()
  })

  it('filters customers by search term (name or slug)', async () => {
    render(
      <MemoryRouter>
        <CustomerListPage />
      </MemoryRouter>
    )

    await waitForLoadingToFinish()

    const searchInput = getSearchInput()

    // 1. Filtrar por nombre
    fireEvent.change(searchInput, { target: { value: 'Acme' } })

    const acmeElement = await screen.findByText('Acme Corporation')
    expect(acmeElement).toBeInTheDocument()

    // Esperar a que Stark Industries desaparezca del DOM
    await waitFor(() => {
      expect(screen.queryByText('Stark Industries')).not.toBeInTheDocument()
    })

    // 2. Filtrar por slug
    fireEvent.change(searchInput, { target: { value: 'stark-ind' } })

    const starkElement = await screen.findByText('Stark Industries')
    expect(starkElement).toBeInTheDocument()

    // Esperar a que Acme Corporation desaparezca del DOM
    await waitFor(() => {
      expect(screen.queryByText('Acme Corporation')).not.toBeInTheDocument()
    })
  })

  it('filters customers by status dropdown', async () => {
    render(
      <MemoryRouter>
        <CustomerListPage />
      </MemoryRouter>
    )

    await waitForLoadingToFinish()

    const statusDropdown = getStatusDropdown()

    // Seleccionar opción SUSPENDED
    fireEvent.change(statusDropdown, { target: { value: 'SUSPENDED' } })

    await waitFor(() => {
      expect(screen.getByText('Stark Industries')).toBeInTheDocument()
      expect(screen.queryByText('Acme Corporation')).not.toBeInTheDocument()
    })
  })
})