import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { CustomerListPage } from './CustomerListPage'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

const { mockList } = vi.hoisted(() => ({
  mockList: vi.fn(),
}))

vi.mock('../../../infrastructure/repositories/httpCustomerRepository', () => {
  return {
    HttpCustomerRepository: vi.fn().mockImplementation(() => ({
      list: mockList,
    })),
  }
})

const mockCustomersList = [
  {
    id: 'cust-001',
    name: 'Acme Corporation',
    slug: 'acme-corp',
    status: 'ACTIVE' as const,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'cust-002',
    name: 'Stark Industries',
    slug: 'stark-ind',
    status: 'SUSPENDED' as const,
    createdAt: '2026-02-20T14:30:00Z',
    updatedAt: '2026-02-20T14:30:00Z',
  },
]

describe('CustomerListPage Filtering & Search', () => {
  beforeEach(() => {
    mockList.mockResolvedValue(mockCustomersList)
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  const getSearchInput = () => screen.getByPlaceholderText(/search by company name or slug/i)
  const getStatusDropdown = () => screen.getByRole('combobox')

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

    fireEvent.change(searchInput, { target: { value: 'Acme' } })

    expect(await screen.findByText('Acme Corporation')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByText('Stark Industries')).not.toBeInTheDocument()
    })

    fireEvent.change(searchInput, { target: { value: 'stark-ind' } })

    expect(await screen.findByText('Stark Industries')).toBeInTheDocument()
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

    fireEvent.change(statusDropdown, { target: { value: 'SUSPENDED' } })

    await waitFor(() => {
      expect(screen.getByText('Stark Industries')).toBeInTheDocument()
      expect(screen.queryByText('Acme Corporation')).not.toBeInTheDocument()
    })
  })

  it('shows empty state when no customers match filter and resets filters when clicking reset button', async () => {
    render(
      <MemoryRouter>
        <CustomerListPage />
      </MemoryRouter>
    )

    await waitForLoadingToFinish()

    const searchInput = getSearchInput()

    fireEvent.change(searchInput, { target: { value: 'NonExistingCompany123' } })

    await waitFor(() => {
      expect(screen.getByText(/no customers found/i)).toBeInTheDocument()
    })

    // Target the specific reset button unambiguously
    const resetButton = screen.getByRole('button', { name: /^reset filters$/i })
    fireEvent.click(resetButton)

    await waitFor(() => {
      expect(screen.getByText('Acme Corporation')).toBeInTheDocument()
      expect(screen.getByText('Stark Industries')).toBeInTheDocument()
    })
  })
})