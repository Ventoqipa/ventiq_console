import { Project, ProjectFilterParams } from '../../domain/project/project'
import { IProjectRepository } from '../../application/ports/projectRepository.port'
import { ApiClient } from '../api/apiClient'

interface PaginatedProjectsResponse {
  data?: Project[]
  items?: Project[]
  content?: Project[]
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export class HttpProjectRepository implements IProjectRepository {
  async list(params?: ProjectFilterParams): Promise<Project[]> {
    return this.fetchAllPages(params)
  }

  private async fetchAllPages(params?: ProjectFilterParams, page = 1): Promise<Project[]> {
    const queryParams = new URLSearchParams()

    if (params?.searchTerm) queryParams.append('search', params.searchTerm)
    if (params?.customerId) queryParams.append('customerId', params.customerId)
    if (params?.status && params.status !== 'ALL') queryParams.append('status', params.status)
    queryParams.append('page', String(page))

    const endpoint = `/admin/projects?${queryParams.toString()}`
    const response = await ApiClient.get<Project[] | PaginatedProjectsResponse>(endpoint)

    if (Array.isArray(response)) {
      return response
    }

    if (response && typeof response === 'object') {
      const items = response.data || response.items || response.content || []
      const totalPages = response.meta?.totalPages || 1

      if (page < totalPages) {
        const nextItems = await this.fetchAllPages(params, page + 1)
        return [...items, ...nextItems]
      }

      return items
    }

    return []
  }

  async getById(id: string): Promise<Project | null> {
    try {
      const project = await ApiClient.get<Project>(`/admin/projects/${id}`)
      return project || null
    } catch {
      return null
    }
  }

  async delete(id: string): Promise<void> {
    await ApiClient.delete(`/admin/projects/${id}`)
  }
}