import { render, screen, fireEvent, waitFor, cleanup, within } from '@testing-library/react'
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CustomerDetailPage } from './CustomerDetailPage'
import { ToastProvider } from '../../context/ToastContext'

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
  mockDeleteCustomer,
  mockDeleteCustomerUser,
} = vi.hoisted(() => ({
  mockGetById: vi.fn(),
  mockGetAdminsByCustomerId: vi.fn(),
  mockUpdateStatus: vi.fn(),
  mockAssignAdmin: vi.fn(),
  mockDeleteCustomer: vi.fn(),
  mockDeleteCustomerUser: vi.fn(),
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
      deleteCustomer: mockDeleteCustomer,
      deleteCustomerUser: mockDeleteCustomerUser,
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
  status: 'ACTIVE' as const,
  createdAt: '2026-01-15T10:00:00Z',
}

describe('CustomerDetailPage', () => {
  beforeEach(() => {
    mockGetById.mockResolvedValue(mockCustomerData)
    mockGetAdminsByCustomerId.mockResolvedValue([mockAdminData])
    mockUpdateStatus.mockResolvedValue({ ...mockCustomerData, status: 'SUSPENDED' })
    mockAssignAdmin.mockResolvedValue(mockAdminData)
    mockDeleteCustomer.mockResolvedValue(undefined)
    mockDeleteCustomerUser.mockResolvedValue(undefined)
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  const renderComponent = (initialEntry: string) =>
    render(
      <ToastProvider>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route path="/customers/:id" element={<CustomerDetailPage />} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    )

  it('renders loading state initially and then shows customer and admin details', async () => {
    renderComponent('/customers/cust-001')

    expect(screen.getByRole('status')).toHaveTextContent(/loading customer details/i)

    await waitFor(() => {
      expect(screen.getByText('Acme Corporation')).toBeInTheDocument()
      expect(screen.getByText('acme-corp')).toBeInTheDocument()
      expect(screen.getByText('cust-001')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john@acme.com')).toBeInTheDocument()
    })
  })

  it('clears state and shows error toast when route lookup fails', async () => {
    mockGetById.mockRejectedValueOnce(new Error('Customer not found'))

    renderComponent('/customers/cust-999')

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Customer not found')
      expect(screen.queryByText('Acme Corporation')).not.toBeInTheDocument()
    })
  })

  it('navigates back to customer list on clicking back button', async () => {
    renderComponent('/customers/cust-001')

    const backButton = await screen.findByRole('button', { name: /back to customers/i })
    fireEvent.click(backButton)

    expect(mockNavigate).toHaveBeenCalledWith('/customers')
  })

  it('executes status change flow successfully through modal confirmation', async () => {
    renderComponent('/customers/cust-001')

    const statusButton = await screen.findByRole('button', { name: /^suspend customer$/i })
    fireEvent.click(statusButton)

    const confirmButton = await screen.findByRole('button', { name: /yes, suspend/i })
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(mockUpdateStatus).toHaveBeenCalledWith('cust-001', 'SUSPENDED')
      expect(mockGetById).toHaveBeenCalledTimes(2)
    })
  })

  it('executes assign admin flow successfully when no admin is assigned', async () => {
    mockGetAdminsByCustomerId.mockResolvedValueOnce([])

    renderComponent('/customers/cust-001')

    const openModalButton = await screen.findByRole('button', { name: /\+ assign user/i })
    fireEvent.click(openModalButton)

    const nameInput = screen.getByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } })
    fireEvent.change(emailInput, { target: { value: 'jane@acme.com' } })
    fireEvent.change(passwordInput, { target: { value: 'SecurePassword123!' } })

    const dialog = screen.getByRole('dialog')
    const submitButton = within(dialog).getByRole('button', { name: /assign admin/i })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockAssignAdmin).toHaveBeenCalled()
    })
  })

  it('executes customer delete flow and navigates to customer list', async () => {
    renderComponent('/customers/cust-001')

    const deleteCustomerButton = await screen.findByRole('button', { name: /^delete customer$/i })
    fireEvent.click(deleteCustomerButton)

    const confirmModal = screen.getByRole('dialog')
    const confirmDeleteBtn = within(confirmModal).getByRole('button', { name: /delete/i })
    fireEvent.click(confirmDeleteBtn)

    await waitFor(() => {
      expect(mockDeleteCustomer).toHaveBeenCalledWith('cust-001')
      expect(mockNavigate).toHaveBeenCalledWith('/customers')
    })
  })

  it('executes user delete flow and refreshes admin list', async () => {
    renderComponent('/customers/cust-001')

    const deleteUserButton = await screen.findByRole('button', { name: /delete user/i })
    fireEvent.click(deleteUserButton)

    const confirmModal = screen.getByRole('dialog')
    const confirmDeleteBtn = within(confirmModal).getByRole('button', { name: /delete/i })
    fireEvent.click(confirmDeleteBtn)

    await waitFor(() => {
      expect(mockDeleteCustomerUser).toHaveBeenCalledWith('cust-001', 'admin-001')
    })
  })
})