import { CustomerRepository } from '../../ports/customerRepository.port'

export class DeleteCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(customerId: string): Promise<void> {
    if (!customerId || customerId.trim() === '') {
      throw new Error('Customer ID is required')
    }
    await this.customerRepository.deleteCustomer(customerId)
  }
}