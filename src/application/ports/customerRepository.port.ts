import { Customer, CustomerStatus } from '../../domain/customer/customer'
import { ClientAdmin, AssignAdminDTO } from '../../domain/customer/clientAdmin'

export interface CustomerRepository {
  list(): Promise<Customer[]>
  getById(id: string): Promise<Customer | null>
  create(customer: Partial<Customer>): Promise<Customer>
  updateStatus(id: string, status: CustomerStatus): Promise<Customer>
  getAdminsByCustomerId(customerId: string): Promise<ClientAdmin[]>
  assignAdmin(
    customerId: string,
    adminData: AssignAdminDTO
  ): Promise<ClientAdmin>
  updateUserStatus(
    customerId: string,
    userId: string,
    status: 'ACTIVE' | 'SUSPENDED'
  ): Promise<ClientAdmin>
}