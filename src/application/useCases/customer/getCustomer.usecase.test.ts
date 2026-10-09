import { describe, expect, it, vi, beforeEach } from 'vitest'
import { GetCustomersUseCase } from './getCustomers.usecase'
import { CustomerRepository } from '../../ports/customerRepository.port'
import { Customer } from '../../../domain/customer/customer'

describe('GetCustomersUseCase', () => {
  let useCase: GetCustomersUseCase
  let mockRepository: CustomerRepository

  const mockCustomers: Customer[] = [
    {
      id: 'cust-1',
      name: 'Acme Corp',
      slug: 'acme-corp',
      status: 'ACTIVE',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
    {
      id: 'cust-2',
      name: 'Globex Inc',
      slug: 'globex-inc',
      status: 'SUSPENDED',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
    {
      id: 'cust-3',
      name: 'Stark Industries',
      status: 'PENDING',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
  ]

  beforeEach(() => {
    mockRepository = {
      list: vi.fn().mockResolvedValue(mockCustomers),
      getById: vi.fn(),
      create: vi.fn(),
      updateStatus: vi.fn(),
      assignAdmin: vi.fn(),
      getAdminsByCustomerId: vi.fn(),
      updateUserStatus: vi.fn(),
    }
    useCase = new GetCustomersUseCase(mockRepository)
  })

  it('should return all customers when no filters are provided', async () => {
    const result = await useCase.execute()

    expect(result).toEqual(mockCustomers)
    expect(mockRepository.list).toHaveBeenCalledTimes(1)
  })

  it('should return all customers when status filter is "ALL" and search is empty', async () => {
    const result = await useCase.execute({ status: 'ALL', search: '' })

    expect(result).toEqual(mockCustomers)
  })

  it('should filter customers by status', async () => {
    const result = await useCase.execute({ status: 'SUSPENDED' })

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Globex Inc')
  })

  it('should filter customers by name search query', async () => {
    const result = await useCase.execute({ search: 'stark' })

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Stark Industries')
  })

  it('should filter customers by slug search query', async () => {
    const result = await useCase.execute({ search: 'globex-inc' })

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Globex Inc')
  })

  it('should correctly handle customers without slug when searching', async () => {
    const result = await useCase.execute({ search: 'acme' })

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Acme Corp')
  })

  it('should combine search and status filters', async () => {
    const result = await useCase.execute({ search: 'Corp', status: 'ACTIVE' })

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Acme Corp')
  })

  it('should return an empty array if no customer matches the filters', async () => {
    const result = await useCase.execute({ search: 'NonExistentCompany' })

    expect(result).toHaveLength(0)
  })
})