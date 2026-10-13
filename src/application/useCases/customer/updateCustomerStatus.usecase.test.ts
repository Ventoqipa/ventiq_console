import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UpdateCustomerStatusUseCase } from './updateCustomerStatus.usecase'
import { CustomerRepository } from '../../ports/customerRepository.port'
import { Customer } from '../../../domain/customer/customer'

describe('UpdateCustomerStatusUseCase', () => {
  let mockRepository: CustomerRepository
  let useCase: UpdateCustomerStatusUseCase

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
    useCase = new UpdateCustomerStatusUseCase(mockRepository)
  })

  it('should update customer status successfully', async () => {
    const mockCustomer: Customer = {
      id: 'cust-001',
      name: 'Acme Corp',
      slug: 'acme-corp',
      status: 'SUSPENDED',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-10-01T00:00:00Z',
    }

    vi.mocked(mockRepository.updateStatus).mockResolvedValue(mockCustomer)

    const result = await useCase.execute('cust-001', 'SUSPENDED')

    expect(mockRepository.updateStatus).toHaveBeenCalledWith('cust-001', 'SUSPENDED')
    expect(result).toEqual(mockCustomer)
  })

  it('should throw an error if customer ID is empty', async () => {
    await expect(useCase.execute('', 'SUSPENDED')).rejects.toThrow(
      'Customer ID is required'
    )
    expect(mockRepository.updateStatus).not.toHaveBeenCalled()
  })
})