import { CustomerRepository } from '../../application/ports/customerRepository.port'
import { Customer, CustomerStatus, CreateCustomerDTO } from '../../domain/customer/customer'
import { ClientAdmin } from '../../domain/customer/clientAdmin'
import { ApiClient } from '../api/apiClient'

export class HttpCustomerRepository implements CustomerRepository {
  async list(): Promise<Customer[]> {
    return await ApiClient.request<Customer[]>('/customers')
  }

  async getById(id: string): Promise<Customer | null> {
    return await ApiClient.request<Customer>(`/customers/${id}`)
  }

  async create(data: CreateCustomerDTO): Promise<Customer> {
    return await ApiClient.request<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateStatus(id: string, status: CustomerStatus): Promise<Customer> {
    return await ApiClient.request<Customer>(`/customers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }

  async assignAdmin(
    customerId: string,
    adminData: Omit<ClientAdmin, 'id' | 'createdAt'>,
  ): Promise<ClientAdmin> {
    return await ApiClient.request<ClientAdmin>(`/customers/${customerId}/admins`, {
      method: 'POST',
      body: JSON.stringify(adminData),
    })
  }

  async getAdminsByCustomerId(customerId: string): Promise<ClientAdmin[]> {
    return await ApiClient.request<ClientAdmin[]>(`/customers/${customerId}/admins`)
  }
}