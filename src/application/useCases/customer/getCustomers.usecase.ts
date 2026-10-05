import { Customer, CustomerStatus } from '../../../domain/customer/customer'
import { CustomerRepository } from '../../ports/customerRepository.port'

export interface GetCustomersFilters {
  search?: string
  status?: CustomerStatus | 'ALL'
}

export class GetCustomersUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(filters?: GetCustomersFilters): Promise<Customer[]> {
    // 1. Llamamos a list() según el puerto
    const customers: Customer[] = await this.customerRepository.list()

    if (!filters) return customers

    const { search, status } = filters

    return customers.filter((customer: Customer) => {
      const searchLower = search?.toLowerCase().trim()
      
      // 2. Usamos customer.slug? para evitar el error con undefined
      const matchesSearch =
        !searchLower ||
        customer.name.toLowerCase().includes(searchLower) ||
        (customer.slug?.toLowerCase().includes(searchLower) ?? false)

      const matchesStatus = !status || status === 'ALL' || customer.status === status

      return matchesSearch && matchesStatus
    })
  }
}