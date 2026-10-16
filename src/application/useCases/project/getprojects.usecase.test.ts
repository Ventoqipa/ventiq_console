import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetProjectsUseCase } from './getProjects.usecase'
import { IProjectRepository } from '../../ports/projectRepository.port'

describe('GetProjectsUseCase', () => {
  let mockRepository: IProjectRepository
  let useCase: GetProjectsUseCase

  beforeEach(() => {
    mockRepository = {
      list: vi.fn(),
      getById: vi.fn(),
      delete: vi.fn(),
    }
    useCase = new GetProjectsUseCase(mockRepository)
  })

  it('should fetch projects list from repository with filters', async () => {
    const mockProjects = [
      {
        id: 'p-001',
        name: 'Portal Clientes',
        customerId: 'c-001',
        customerName: 'Acme Corp',
        status: 'ACTIVE' as const,
        createdAt: '2026-10-15T10:00:00Z',
        updatedAt: '2026-10-15T10:00:00Z',
      },
    ]

    vi.mocked(mockRepository.list).mockResolvedValue(mockProjects)

    const filters = { searchTerm: 'Portal', status: 'ACTIVE' as const }
    const result = await useCase.execute(filters)

    expect(mockRepository.list).toHaveBeenCalledWith(filters)
    expect(result).toEqual(mockProjects)
  })
})