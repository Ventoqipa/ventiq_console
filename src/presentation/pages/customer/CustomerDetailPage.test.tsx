import { render, screen, fireEvent, waitFor, cleanup, within } from '@testing-library/react'
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
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

const {
  mockGetById,
  mockGetAdminsByCustomerId,
  mockUpdateStatus,
  mockAssignAdmin,
  mockUpdateUserStatus,
} = vi.hoisted(() => ({
  mockGetById: vi.fn(),
  mockGetAdminsByCustomerId: vi.fn(),
  mockUpdateStatus: vi.fn(),
  mockAssignAdmin: vi.fn(),
  mockUpdateUserStatus: vi.fn(),
}))

vi.mock('../../../infrastructure/repositories/httpCustomerRepository', () => {
  return {
    HttpCustomerRepository: vi.fn().mockImplementation(() => ({
      getById: mockGetById,
      getAdminsByCustomerId: mockGetAdminsByCustomerId,
      updateStatus: mockUpdateStatus,
      updateCustomerStatus: mockUpdateStatus,
      assignAdmin: mockAssignAdmin,
      assignClientAdmin: mockAssignAdmin,
      updateUserStatus: mockUpdateUserStatus,
    })),
  }
})

const mockCustomerData = {
  id: 'cust-001',
  name: 'Acme Corporation',
  slug: 'acme-corp',
  status: 'ACTIVE' as const,
  createdAt: '2026-01-15T10:00:00Z',
  updatedAt: '2026-01-15T10:00:00Z',
}

const mockAdminData = {
  id: 'admin-001',
  customerId: 'cust-001',
  fullName: 'John Doe',
  email: 'john@acme.com',
  role: 'ADMIN' as const,
  createdAt: '2026-01-15T10:00:00Z',
}

describe('CustomerDetailPage', () => {
  beforeEach(() => {
    mockGetById.mockResolvedValue(mockCustomerData)
    mockGetAdminsByCustomerId.mockResolvedValue([mockAdminData])
    mockUpdateStatus.mockResolvedValue({ ...mockCustomerData, status: 'SUSPENDED' })
    mockAssignAdmin.mockResolvedValue(mockAdminData)
    mockUpdateUserStatus.mockResolvedValue(undefined)
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders loading state initially and then shows customer and admin details', async () => {
    render(
      <MemoryRouter initialEntries={['/customers/cust-001']}>
        <Routes>
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByRole('status')).toHaveTextContent(/loading customer details/i)

    await waitFor(() => {
      expect(screen.getByText('Acme Corporation')).toBeInTheDocument()
      expect(screen.getByText('acme-corp')).toBeInTheDocument()
      expect(screen.getByText('cust-001')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john@acme.com')).toBeInTheDocument()
    })
  })

  it('clears state and shows error message when route lookup fails', async () => {
    mockGetById.mockRejectedValueOnce(new Error('Customer not found'))

    render(
      <MemoryRouter initialEntries={['/customers/cust-999']}>
        <Routes>
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Failed to load customer details.')
      expect(screen.queryByText('Acme Corporation')).not.toBeInTheDocument()
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

  it('executes status change flow successfully through modal confirmation', async () => {
    render(
      <MemoryRouter initialEntries={['/customers/cust-001']}>
        <Routes>
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    const statusButton = await screen.findByRole('button', { name: /^suspend customer$/i })
    fireEvent.click(statusButton)

    const confirmButton = await screen.findByRole('button', { name: /yes, suspend/i })
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(mockUpdateStatus).toHaveBeenCalledWith('cust-001', 'SUSPENDED')
    })
  })

  it('executes assign admin flow successfully when no admin is assigned', async () => {
    mockGetAdminsByCustomerId.mockResolvedValueOnce([])

    render(
      <MemoryRouter initialEntries={['/customers/cust-001']}>
        <Routes>
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    // 1. Click the button on the page to open the modal (Coincide con "+ Assign User")
    const openModalButton = await screen.findByRole('button', { name: /\+ assign user/i })
    fireEvent.click(openModalButton)

    // 2. Fill in form inputs
    const nameInput = screen.getByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } })
    fireEvent.change(emailInput, { target: { value: 'jane@acme.com' } })
    fireEvent.change(passwordInput, { target: { value: 'SecurePassword123!' } })

    // 3. Scope the search specifically to the dialog modal
    const dialog = screen.getByRole('dialog')
    const submitButton = within(dialog).getByRole('button', { name: /assign admin/i })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockAssignAdmin).toHaveBeenCalled()
    })
  })
})