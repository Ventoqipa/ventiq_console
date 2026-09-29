import { CustomerRepository } from '../../application/ports/customerRepository.port'
import { Customer, CreateCustomerDTO } from '../../domain/customer/customer'
import { ApiClient } from '../api/apiClient'

export class ApiCustomerRepository implements CustomerRepository {
  async getAll(): Promise<Customer[]> {
    return ApiClient.request<Customer[]>('/customers')
  }

  async getById(id: string): Promise<Customer | null> {
    try {
      return await ApiClient.request<Customer>(`/customers/${id}`)
    } catch {
      return null
    }
  }

  async create(data: CreateCustomerDTO): Promise<Customer> {
    return ApiClient.request<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}