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

    vi.spyOn(ApiClient, 'get').mockResolvedValueOnce(mockCustomers)

    const result = await repository.list()
    expect(result).toEqual(mockCustomers)
    expect(ApiClient.get).toHaveBeenCalledWith('/admin/customers')
  })

  it('should propagate error when getById fails', async () => {
    vi.spyOn(ApiClient, 'get').mockRejectedValueOnce(new Error('Not found'))

    await expect(repository.getById('invalid-id')).rejects.toThrow('Not found')
  })

  it('should create a new customer with name and generated slug', async () => {
    const mockCreated = {
      id: 'cust-1',
      name: 'Acme Media',
      slug: 'acme-media',
      status: 'PENDING' as const,
      createdAt: '2026-10-12',
      updatedAt: '2026-10-12',
    }

    vi.spyOn(ApiClient, 'post').mockResolvedValueOnce(mockCreated)

    const result = await repository.create({ name: 'Acme Media', slug: 'acme-media' })

    expect(result).toEqual(mockCreated)
    expect(ApiClient.post).toHaveBeenCalledWith('/admin/customers', {
      name: 'Acme Media',
      slug: 'acme-media',
    })
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

    vi.spyOn(ApiClient, 'patch').mockResolvedValueOnce(mockUpdated)

    const result = await repository.updateStatus('cust-1', 'SUSPENDED')
    expect(result.status).toBe('SUSPENDED')
    expect(ApiClient.patch).toHaveBeenCalledWith('/admin/customers/cust-1/status', {
      status: 'SUSPENDED',
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

    vi.spyOn(ApiClient, 'post').mockResolvedValueOnce(mockAdmin)

    const result = await repository.assignAdmin('cust-1', adminPayload)

    expect(result).toEqual(mockAdmin)
    expect(ApiClient.post).toHaveBeenCalledWith('/admin/customers/cust-1/users', adminPayload)
  })

  it('should delete a customer via DELETE request', async () => {
    vi.spyOn(ApiClient, 'delete').mockResolvedValueOnce(undefined)

    await repository.deleteCustomer('cust-1')

    expect(ApiClient.delete).toHaveBeenCalledWith('/admin/customers/cust-1')
  })

  it('should delete a customer user via DELETE request', async () => {
    vi.spyOn(ApiClient, 'delete').mockResolvedValueOnce(undefined)

    await repository.deleteCustomerUser('cust-1', 'usr-1')

    expect(ApiClient.delete).toHaveBeenCalledWith('/admin/customers/cust-1/users/usr-1')
  })

  it('should propagate error when updateStatus API request fails', async () => {
    vi.spyOn(ApiClient, 'patch').mockRejectedValueOnce(new Error('Network error'))

    await expect(repository.updateStatus('cust-001', 'SUSPENDED')).rejects.toThrow('Network error')
  })
})