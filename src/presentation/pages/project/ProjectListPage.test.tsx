import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { ProjectListPage } from './ProjectListPage'
import { ToastProvider } from '../../context'

const { mockProjectList, mockProjectDelete, mockCustomerList } = vi.hoisted(() => ({
  mockProjectList: vi.fn(),
  mockProjectDelete: vi.fn(),
  mockCustomerList: vi.fn(),
}))

vi.mock('../../../infrastructure/repositories/httpProjectRepository', () => ({
  HttpProjectRepository: vi.fn().mockImplementation(() => ({
    list: mockProjectList,
    delete: mockProjectDelete,
  })),
}))

vi.mock('../../../infrastructure/repositories/httpCustomerRepository', () => ({
  HttpCustomerRepository: vi.fn().mockImplementation(() => ({
    list: mockCustomerList,
  })),
}))

const mockProjects = [
  {
    id: 'p-001',
    name: 'E-commerce Redesign',
    customerId: 'cust-001',
    customerName: 'Acme Corporation',
    status: 'ACTIVE' as const,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'p-002',
    name: 'Mobile App API',
    customerId: 'cust-002',
    customerName: 'Stark Industries',
    status: 'SUSPENDED' as const,
    createdAt: '2026-02-20T14:30:00Z',
    updatedAt: '2026-02-20T14:30:00Z',
  },
]

const mockCustomers = [
  { id: 'cust-001', name: 'Acme Corporation' },
  { id: 'cust-002', name: 'Stark Industries' },
]

describe('ProjectListPage UI & Actions', () => {
  beforeEach(() => {
    mockProjectList.mockResolvedValue(mockProjects)
    mockCustomerList.mockResolvedValue(mockCustomers)
    mockProjectDelete.mockResolvedValue(undefined)
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  const waitForLoadingToFinish = async () => {
    const loadingElement = screen.queryByText(/loading projects\.\.\./i)
    if (loadingElement) {
      await waitForElementToBeRemoved(loadingElement)
    }
  }

  const renderComponent = () =>
    render(
      <ToastProvider>
        <MemoryRouter>
          <ProjectListPage />
        </MemoryRouter>
      </ToastProvider>
    )

  it('renders project list table and filter controls', async () => {
    renderComponent()
    await waitForLoadingToFinish()

    expect(screen.getByPlaceholderText(/search by project name\.\.\./i)).toBeInTheDocument()
    expect(screen.getByText('E-commerce Redesign')).toBeInTheDocument()
    expect(screen.getByText('Mobile App API')).toBeInTheDocument()
  })

  it('triggers delete flow when delete button is clicked and modal is confirmed', async () => {
    renderComponent()
    await waitForLoadingToFinish()

    const deleteButton = screen.getByRole('button', { name: /delete project e-commerce redesign/i })
    fireEvent.click(deleteButton)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/are you sure you want to delete project/i)).toBeInTheDocument()

    const confirmModalButton = screen.getByRole('button', { name: /^delete$/i })
    fireEvent.click(confirmModalButton)

    await waitFor(() => {
      expect(mockProjectDelete).toHaveBeenCalledWith('p-001')
    })
  })
})