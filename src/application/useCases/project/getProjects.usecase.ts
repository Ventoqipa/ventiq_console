import { Project, ProjectFilterParams } from '../../../domain/project/project'
import { IProjectRepository } from '../../ports/projectRepository.port'

export class GetProjectsUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(params?: ProjectFilterParams): Promise<Project[]> {
    return this.projectRepository.list(params)
  }
}