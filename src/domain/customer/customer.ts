export interface Customer {
  id: string
  name: string
  legalName?: string
  taxId?: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  createdAt: string
  updatedAt: string
}

export type CreateCustomerDTO = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>