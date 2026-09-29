import { Customer, CreateCustomerDTO } from '../../domain/customer/customer'

export interface CustomerRepository {
  getAll(): Promise<Customer[]>
  getById(id: string): Promise<Customer | null>
  create(data: CreateCustomerDTO): Promise<Customer>
}