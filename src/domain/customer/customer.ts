export type CustomerStatus = 'ACTIVE' | 'SUSPENDED' | 'PAUSED' | 'INACTIVE'

export interface Customer {
  id: string
  name: string
  slug?: string
  legalName?: string
  taxId?: string
  status: CustomerStatus
  createdAt: string
  updatedAt: string
}

export type CreateCustomerDTO = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>