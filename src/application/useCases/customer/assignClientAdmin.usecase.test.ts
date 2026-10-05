import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AssignClientAdminUseCase } from './assignClientAdmin.usecase'
import { CustomerRepository } from '../../ports/customerRepository.port'

describe('AssignClientAdminUseCase', () => {
  let repositoryMock: Partial<CustomerRepository>
  let useCase: AssignClientAdminUseCase

  beforeEach(() => {
    repositoryMock = {
      assignAdmin: vi.fn().mockResolvedValue({
        id: 'admin-123',
        customerId: 'cust-001',
        name: 'John Doe',
        email: 'john.doe@acme.com',
        role: 'ADMIN',
        createdAt: '2026-10-01T12:00:00Z',
      }),
    }
    useCase = new AssignClientAdminUseCase(repositoryMock as CustomerRepository)
  })

  it('should assign admin successfully with valid data', async () => {
    const adminData = {
      name: 'John Doe',
      email: 'john.doe@acme.com',
      role: 'ADMIN' as const,
    }

    const result = await useCase.execute('cust-001', adminData)

    expect(repositoryMock.assignAdmin).toHaveBeenCalledWith('cust-001', {
      ...adminData,
      customerId: 'cust-001',
    })
    expect(result.id).toBe('admin-123')
  })

  it('should throw an error if customer ID is empty', async () => {
    const adminData = {
      name: 'John Doe',
      email: 'john.doe@acme.com',
      role: 'ADMIN' as const,
    }

    await expect(useCase.execute('', adminData)).rejects.toThrow('Customer ID is required')
  })

  it('should throw an error if email is invalid', async () => {
    const adminData = {
      name: 'John Doe',
      email: 'invalid-email',
      role: 'ADMIN' as const,
    }

    await expect(useCase.execute('cust-001', adminData)).rejects.toThrow('Valid email address is required')
  })

  it('should throw an error if name is missing', async () => {
    const adminData = {
      name: '',
      email: 'john.doe@acme.com',
      role: 'ADMIN' as const,
    }

    await expect(useCase.execute('cust-001', adminData)).rejects.toThrow('Admin name is required')
  })
})