import { Project, ProjectFilterParams } from '../../domain/project/project'

export interface IProjectRepository {
  list(params?: ProjectFilterParams): Promise<Project[]>
  getById(id: string): Promise<Project | null>
  delete(id: string): Promise<void>
}