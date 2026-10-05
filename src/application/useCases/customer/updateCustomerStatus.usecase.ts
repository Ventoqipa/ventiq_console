import { CustomerRepository } from '../../ports/customerRepository.port'
import { Customer, CustomerStatus } from '../../../domain/customer/customer'

export class UpdateCustomerStatusUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(id: string, status: CustomerStatus): Promise<Customer> {
    if (!id || !id.trim()) {
      throw new Error('Customer ID is required')
    }

    if (!status) {
      throw new Error('Status is required')
    }

    return await this.customerRepository.updateStatus(id.trim(), status)
  }
}