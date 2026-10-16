import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DeleteProjectUseCase } from './deleteProject.usecase'
import { IProjectRepository } from '../../ports/projectRepository.port'

describe('DeleteProjectUseCase', () => {
  let mockRepository: IProjectRepository
  let useCase: DeleteProjectUseCase

  beforeEach(() => {
    mockRepository = {
      list: vi.fn(),
      getById: vi.fn(),
      delete: vi.fn(),
    }
    useCase = new DeleteProjectUseCase(mockRepository)
  })

  it('should call repository delete method with correct ID', async () => {
    vi.mocked(mockRepository.delete).mockResolvedValue()

    await useCase.execute('p-001')

    expect(mockRepository.delete).toHaveBeenCalledWith('p-001')
  })

  it('should throw an error if project ID is empty', async () => {
    await expect(useCase.execute('')).rejects.toThrow('Project ID is required for deletion.')
  })
})