import { describe, expect, it, vi, beforeEach } from 'vitest'
import { HttpCustomerRepository } from './httpCustomerRepository'
import { ApiClient } from '../api/apiClient'
import { Customer } from '../../domain/customer/customer'

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
        slug: 'acme-corp',
        status: 'ACTIVE',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
    ]

    vi.spyOn(ApiClient, 'request').mockResolvedValueOnce(mockCustomers)

    const result = await repository.list()
    expect(result).toEqual(mockCustomers)
    expect(ApiClient.request).toHaveBeenCalledWith('/admin/customers', {
      method: 'GET',
    })
  })

  it('should propagate error when getById fails', async () => {
    vi.spyOn(ApiClient, 'request').mockRejectedValueOnce(new Error('Not found'))

    await expect(repository.getById('invalid-id')).rejects.toThrow('Not found')
  })

  it('should update customer status', async () => {
    const mockUpdated: Customer = {
      id: 'cust-1',
      name: 'Acme Corp',
      slug: 'acme-corp',
      status: 'SUSPENDED',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-02',
    }

    vi.spyOn(ApiClient, 'request').mockResolvedValueOnce(mockUpdated)

    const result = await repository.updateStatus('cust-1', 'SUSPENDED')
    expect(result.status).toBe('SUSPENDED')
    expect(ApiClient.request).toHaveBeenCalledWith('/admin/customers/cust-1/status', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'SUSPENDED' }),
    })
  })

  it('should assign a client admin', async () => {
    const mockAdmin = {
      id: 'admin-1',
      email: 'admin@acme.com',
      fullName: 'John Doe',
      role: 'ADMIN',
      status: 'ACTIVE',
      createdAt: '2026-01-01',
    }

    const adminPayload = {
      fullName: 'John Doe',
      email: 'admin@acme.com',
      password: 'Password123456!',
    }

    vi.spyOn(ApiClient, 'request').mockResolvedValueOnce(mockAdmin)

    const result = await repository.assignAdmin('cust-1', adminPayload)

    expect(result).toEqual(mockAdmin)
    expect(ApiClient.request).toHaveBeenCalledWith('/admin/customers/cust-1/users', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@acme.com',
        password: 'Password123456!',
      }),
    })
  })

  it('should propagate error when updateStatus API request fails', async () => {
    vi.spyOn(ApiClient, 'request').mockRejectedValueOnce(new Error('Network error'))

    await expect(repository.updateStatus('cust-001', 'SUSPENDED')).rejects.toThrow('Network error')
  })
})