import { CustomerRepository } from '../../ports/customerRepository.port'

export class DeleteCustomerUserUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(customerId: string, userId: string): Promise<void> {
    if (!customerId || customerId.trim() === '') {
      throw new Error('Customer ID is required')
    }
    if (!userId || userId.trim() === '') {
      throw new Error('User ID is required')
    }
    await this.customerRepository.deleteCustomerUser(customerId, userId)
  }
}