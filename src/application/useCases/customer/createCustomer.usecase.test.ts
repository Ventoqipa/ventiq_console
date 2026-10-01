import { describe, expect, it, vi, beforeEach } from 'vitest'
import { CreateCustomerUseCase } from './createCustomer.usecase'
import { CustomerRepository } from '../../ports/customerRepository.port'
import { Customer, CustomerStatus } from '../../../domain/customer/customer'

describe('CreateCustomerUseCase', () => {
  let useCase: CreateCustomerUseCase
  let mockRepository: CustomerRepository

  beforeEach(() => {
    mockRepository = {
      list: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      updateStatus: vi.fn(),
      assignAdmin: vi.fn(),
    }
    useCase = new CreateCustomerUseCase(mockRepository)
  })

  it('should create a customer successfully', async () => {
    const newCustomerData = { 
      name: 'Acme Corp',
      status: 'ACTIVE' as CustomerStatus 
    }
    
    const createdCustomer: Customer = {
      id: 'cust-123',
      name: 'Acme Corp',
      status: 'ACTIVE',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    }

    vi.spyOn(mockRepository, 'create').mockResolvedValueOnce(createdCustomer)

    const result = await useCase.execute(newCustomerData)

    expect(result).toEqual(createdCustomer)
    expect(mockRepository.create).toHaveBeenCalledWith(newCustomerData)
  })

  it('should throw an error if customer name is empty', async () => {
    const invalidData = { 
      name: '', 
      status: 'ACTIVE' as CustomerStatus 
    }

    await expect(useCase.execute(invalidData)).rejects.toThrow('Customer name is required')
    expect(mockRepository.create).not.toHaveBeenCalled()
  })
})