import { IProjectRepository } from '../../ports/projectRepository.port'

export class DeleteProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(id: string): Promise<void> {
    if (!id || id.trim() === '') {
      throw new Error('Project ID is required for deletion.')
    }
    await this.projectRepository.delete(id)
  }
}