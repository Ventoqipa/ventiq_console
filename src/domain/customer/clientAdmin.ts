export interface ClientAdmin {
  id: string
  fullName?: string
  email: string
  role?: string
  status?: string
  createdAt?: string
}

export interface AssignAdminDTO {
  fullName?: string
  email: string
  password: string
  role?: 'ADMIN'
  customerId?: string
}