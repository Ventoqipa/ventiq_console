import { describe, expect, it, vi, beforeEach } from 'vitest'
import { HttpCustomerRepository } from './httpCustomerRepository'
import { ApiClient } from '../api/apiClient'
import { Customer } from '../../domain/customer/customer'
import { ClientAdmin } from '../../domain/customer/clientAdmin'

describe('HttpCustomerRepository', () => {
  let repository: HttpCustomerRepository

  beforeEach(() => {
    repository = new HttpCustomerRepository()
    vi.restoreAllMocks()
  })

  it('should fetch all customers via ApiClient', async () => {
    const mockCustomers: Customer[] = [
      {
        id: 'cust-1',
        name: 'Acme Corp',
        status: 'ACTIVE',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
    ]

    vi.spyOn(ApiClient, 'request').mockResolvedValueOnce(mockCustomers)

    const result = await repository.list()
    expect(result).toEqual(mockCustomers)
    expect(ApiClient.request).toHaveBeenCalledWith('/customers')
  })

  it('should return null when getById fails', async () => {
    vi.spyOn(ApiClient, 'request').mockRejectedValueOnce(new Error('Not found'))

    const result = await repository.getById('invalid-id')
    expect(result).toBeNull()
  })

  it('should update customer status', async () => {
    const mockUpdated: Customer = {
      id: 'cust-1',
      name: 'Acme Corp',
      status: 'SUSPENDED',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-02',
    }

    vi.spyOn(ApiClient, 'request').mockResolvedValueOnce(mockUpdated)

    const result = await repository.updateStatus('cust-1', 'SUSPENDED')
    expect(result.status).toBe('SUSPENDED')
    expect(ApiClient.request).toHaveBeenCalledWith('/customers/cust-1/status', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'SUSPENDED' }),
    })
  })

  it('should assign a client admin', async () => {
    const mockAdmin: ClientAdmin = {
      id: 'admin-1',
      customerId: 'cust-1',
      email: 'admin@acme.com',
      fullName: 'John Doe',
      role: 'ADMIN',
      createdAt: '2026-01-01',
    }

    vi.spyOn(ApiClient, 'request').mockResolvedValueOnce(mockAdmin)

    const result = await repository.assignAdmin('cust-1', {
      customerId: 'cust-1',
      email: 'admin@acme.com',
      fullName: 'John Doe',
      role: 'ADMIN',
    })

    expect(result).toEqual(mockAdmin)
  })

  it('should fallback to local mock data when updateStatus API request fails', async () => {
    vi.spyOn(ApiClient, 'request').mockRejectedValueOnce(new Error('Network error'))

    const result = await repository.updateStatus('cust-001', 'SUSPENDED')

    expect(result.id).toBe('cust-001')
    expect(result.status).toBe('SUSPENDED')
  })
})