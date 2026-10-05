export interface ClientAdmin {
  id: string
  customerId: string
  email: string
  fullName: string
  role: 'ADMIN' | 'OWNER'
  createdAt: string
}