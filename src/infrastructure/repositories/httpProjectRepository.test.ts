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
    }

    vi.mocked(ApiClient.get).mockResolvedValueOnce(mockApiResponse)

    const projects = await repository.list({
      searchTerm: 'Redesign',
      customerId: 'c-001',
      status: 'ACTIVE',
    })

    expect(ApiClient.get).toHaveBeenCalledWith(
      '/admin/projects?search=Redesign&customerId=c-001&status=ACTIVE'
    )
    expect(projects).toEqual(mockApiResponse.data)
  })

  it('should delete a project successfully', async () => {
    vi.mocked(ApiClient.delete).mockResolvedValueOnce(undefined)

    await repository.delete('p-101')

    expect(ApiClient.delete).toHaveBeenCalledWith('/admin/projects/p-101')
  })
})