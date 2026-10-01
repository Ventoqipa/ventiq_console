import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CustomerDetailPage } from './CustomerDetailPage'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock del repositorio de datos para controlar las respuestas en los tests
vi.mock('../../../infrastructure/repositories/httpCustomerRepository', () => {
  return {
    HttpCustomerRepository: vi.fn().mockImplementation(() => ({
      getById: vi.fn().mockResolvedValue(null), // Forzamos a que use MOCK_CUSTOMERS en pruebas si la API retorna null
      getAdminsByCustomerId: vi.fn().mockResolvedValue([]),
      updateStatus: vi.fn().mockResolvedValue({
        id: 'cust-001',
        name: 'Acme Corporation',
        slug: 'acme-corp',
        status: 'SUSPENDED',
      }),
      assignAdmin: vi.fn(),
    })),
  }
})

describe('CustomerDetailPage', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders loading state initially and then shows customer details', async () => {
    render(
      <MemoryRouter initialEntries={['/customers/cust-001']}>
        <Routes>
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    // Verifica que cargue el nombre y los metadatos de MOCK_CUSTOMERS ('cust-001')
    await waitFor(() => {
      expect(screen.getByText('Acme Corporation')).toBeInTheDocument()
      expect(screen.getByText('acme-corp')).toBeInTheDocument()
      expect(screen.getByText('cust-001')).toBeInTheDocument()
    })
  })

  it('navigates back to customer list on clicking back button', async () => {
    render(
      <MemoryRouter initialEntries={['/customers/cust-001']}>
        <Routes>
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    const backButton = await screen.findByRole('button', { name: /back to customers/i })
    fireEvent.click(backButton)

    expect(mockNavigate).toHaveBeenCalledWith('/customers')
  })

    it('opens status confirmation modal when clicking status button', async () => {
    render(
      <MemoryRouter initialEntries={['/customers/cust-001']}>
        <Routes>
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    // Buscamos específicamente el botón principal usando su rol y texto exacto
    const statusButton = await screen.findByRole('button', { name: /^suspend customer$/i })
    fireEvent.click(statusButton)

    // Verificamos que el modal se abrió buscando el título del modal o el botón de confirmación
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /suspend customer access/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /yes, suspend/i })).toBeInTheDocument()
    })
  })
})