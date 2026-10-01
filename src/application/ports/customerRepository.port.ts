import { Customer, CustomerStatus, CreateCustomerDTO } from '../../domain/customer/customer'
import { ClientAdmin } from '../../domain/customer/clientAdmin'

export interface CustomerRepository {
  list(): Promise<Customer[]>
  getById(id: string): Promise<Customer | null>
  create(data: CreateCustomerDTO): Promise<Customer>
  updateStatus(id: string, status: CustomerStatus): Promise<Customer>
  assignAdmin(customerId: string, adminData: Omit<ClientAdmin, 'id' | 'createdAt'>): Promise<ClientAdmin>
}