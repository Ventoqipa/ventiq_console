import { Customer, CustomerStatus } from '../../../domain/customer/customer'
import { CustomerRepository } from '../../ports/customerRepository.port'

export interface GetCustomersFilters {
  search?: string
  status?: CustomerStatus | 'ALL'
}

export class GetCustomersUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(filters?: GetCustomersFilters): Promise<Customer[]> {
    const customers: Customer[] = await this.customerRepository.list()

    if (!filters) return customers

    const { search, status } = filters

    return customers.filter((customer: Customer) => {
      const searchLower = search?.toLowerCase().trim()

      const matchesSearch =
        !searchLower ||
        customer.name.toLowerCase().includes(searchLower) ||
        customer.slug.toLowerCase().includes(searchLower)

      const matchesStatus = !status || status === 'ALL' || customer.status === status

      return matchesSearch && matchesStatus
    })
  }
}