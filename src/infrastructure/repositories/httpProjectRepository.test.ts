import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { HttpProjectRepository } from './httpProjectRepository'
import { ApiClient } from '../api/apiClient'

vi.mock('../api/apiClient', () => ({
  ApiClient: {
    get: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('HttpProjectRepository', () => {
  let repository: HttpProjectRepository

  beforeEach(() => {
    repository = new HttpProjectRepository()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should list projects and build query parameters correctly', async () => {
    const mockApiResponse = {
      data: [
        {
          id: 'p-101',
          name: 'E-commerce Redesign',
          customerId: 'c-001',
          customerName: 'Stark Industries',
          status: 'ACTIVE' as const,
          createdAt: '2026-10-15T10:00:00Z',
          updatedAt: '2026-10-15T10:00:00Z',
        },
      ],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    }

    vi.mocked(ApiClient.get).mockResolvedValueOnce(mockApiResponse)

    const projects = await repository.list({
      searchTerm: 'Redesign',
      customerId: 'c-001',
      status: 'ACTIVE',
    })

    expect(ApiClient.get).toHaveBeenCalledWith(
      '/admin/projects?search=Redesign&customerId=c-001&status=ACTIVE&page=1'
    )
    expect(projects).toEqual(mockApiResponse.data)
  })

  it('should fetch all pages recursively when response contains totalPages > 1', async () => {
    const page1Response = {
      data: [
        { id: 'p-1', name: 'Project 1', customerId: 'c-1', customerName: 'Customer 1', status: 'ACTIVE' as const, createdAt: '', updatedAt: '' },
      ],
      meta: { page: 1, limit: 1, total: 2, totalPages: 2 },
    }

    const page2Response = {
      data: [
        { id: 'p-2', name: 'Project 2', customerId: 'c-1', customerName: 'Customer 1', status: 'ACTIVE' as const, createdAt: '', updatedAt: '' },
      ],
      meta: { page: 2, limit: 1, total: 2, totalPages: 2 },
    }

    vi.mocked(ApiClient.get)
      .mockResolvedValueOnce(page1Response)
      .mockResolvedValueOnce(page2Response)

    const projects = await repository.list()

    expect(ApiClient.get).toHaveBeenNthCalledWith(1, '/admin/projects?page=1')
    expect(ApiClient.get).toHaveBeenNthCalledWith(2, '/admin/projects?page=2')
    expect(projects).toHaveLength(2)
    expect(projects).toEqual([...page1Response.data, ...page2Response.data])
  })

  it('should delete a project successfully', async () => {
    vi.mocked(ApiClient.delete).mockResolvedValueOnce(undefined)

    await repository.delete('p-101')

    expect(ApiClient.delete).toHaveBeenCalledWith('/admin/projects/p-101')
  })
})