export interface ClientAdmin {
  id: string
  customerId: string
  email: string
  name: string
  role: 'ADMIN' | 'OWNER'
  createdAt: string
}