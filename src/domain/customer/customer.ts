export type CustomerStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED'

export interface Customer {
  id: string
  name: string
  slug?: string
  status: CustomerStatus
  createdAt: string
  updatedAt: string
}

export type CreateCustomerDTO = {
  name: string
  slug?: string
}