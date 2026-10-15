export type ProjectStatus = 'ACTIVE' | 'SUSPENDED'

export interface Project {
  id: string
  name: string
  customerId: string
  customerName: string
  status: ProjectStatus
  createdAt: string
  updatedAt: string
  slug?: string
}

export interface ProjectFilterParams {
  searchTerm?: string
  customerId?: string
  status?: ProjectStatus | 'ALL'
}