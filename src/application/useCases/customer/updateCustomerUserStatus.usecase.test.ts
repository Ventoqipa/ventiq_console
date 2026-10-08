import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UpdateCustomerUserStatusUseCase } from './updateCustomerUserStatus.usecase'
import { CustomerRepository } from '../../ports/customerRepository.port'
import { ClientAdmin } from '../../../domain/customer/clientAdmin'

describe('UpdateCustomerUserStatusUseCase', () => {
  let mockRepository: CustomerRepository
  let useCase: UpdateCustomerUserStatusUseCase

  beforeEach(() => {
    mockRepository = {
      list: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      updateStatus: vi.fn(),
      getAdminsByCustomerId: vi.fn(),
      assignAdmin: vi.fn(),
      updateUserStatus: vi.fn(),
    }
    useCase = new UpdateCustomerUserStatusUseCase(mockRepository)
  })

  it('should update customer user status successfully', async () => {
    const mockUser: ClientAdmin = {
      id: 'usr-001',
      fullName: 'John Doe',
      email: 'john@acme.com',
      role: 'CLIENT_ADMIN',
      status: 'SUSPENDED',
      createdAt: '2026-01-01T00:00:00Z',
    }

    vi.mocked(mockRepository.updateUserStatus).mockResolvedValue(mockUser)

    const result = await useCase.execute('cust-001', 'usr-001', 'SUSPENDED')

    expect(mockRepository.updateUserStatus).toHaveBeenCalledWith('cust-001', 'usr-001', 'SUSPENDED')
    expect(result).toEqual(mockUser)
  })

  it('should throw an error if customer ID is empty', async () => {
    await expect(useCase.execute('', 'usr-001', 'SUSPENDED')).rejects.toThrow(
      'Customer ID is required'
    )
    expect(mockRepository.updateUserStatus).not.toHaveBeenCalled()
  })

  it('should throw an error if user ID is empty', async () => {
    await expect(useCase.execute('cust-001', '', 'SUSPENDED')).rejects.toThrow(
      'User ID is required'
    )
    expect(mockRepository.updateUserStatus).not.toHaveBeenCalled()
  })
})