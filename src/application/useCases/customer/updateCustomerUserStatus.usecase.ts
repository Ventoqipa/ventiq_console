import { CustomerRepository } from '../../ports/customerRepository.port'
import { ClientAdmin } from '../../../domain/customer/clientAdmin'

export class UpdateCustomerUserStatusUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(
    customerId: string,
    userId: string,
    status: 'ACTIVE' | 'SUSPENDED'
  ): Promise<ClientAdmin> {
    if (!customerId || customerId.trim() === '') {
      throw new Error('Customer ID is required')
    }
    if (!userId || userId.trim() === '') {
      throw new Error('User ID is required')
    }

    return await this.customerRepository.updateUserStatus(customerId, userId, status)
  }
}