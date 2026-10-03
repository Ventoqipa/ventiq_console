import { CustomerRepository } from '../../ports/customerRepository.port'
import { ClientAdmin } from '../../../domain/customer/clientAdmin'

export type AssignAdminDTO = Omit<ClientAdmin, 'id' | 'createdAt' | 'customerId'>

export class AssignClientAdminUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(customerId: string, adminData: AssignAdminDTO): Promise<ClientAdmin> {
    if (!customerId || customerId.trim() === '') {
      throw new Error('Customer ID is required')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!adminData.email || !emailRegex.test(adminData.email)) {
      throw new Error('Valid email address is required')
    }

    if (!adminData.fullName || adminData.fullName.trim() === '') {
      throw new Error('Admin full name is required')
    }

    return await this.customerRepository.assignAdmin(customerId, {
      ...adminData,
      customerId,
    })
  }
}