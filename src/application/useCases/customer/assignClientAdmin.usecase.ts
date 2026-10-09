import { CustomerRepository } from '../../ports/customerRepository.port'
import { ClientAdmin, AssignAdminDTO } from '../../../domain/customer/clientAdmin'

export class AssignClientAdminUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(customerId: string, adminData: AssignAdminDTO): Promise<ClientAdmin> {
    // 1. Validate customer ID
    if (!customerId || customerId.trim() === '') {
      throw new Error('Customer ID is required')
    }

    // 2. Validate admin full name
    if (!adminData.fullName || adminData.fullName.trim() === '') {
      throw new Error('Admin full name is required')
    }

    // 3. Validate email address format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!adminData.email || !emailRegex.test(adminData.email)) {
      throw new Error('Valid email address is required')
    }

    // 4. Validate password length
    if (!adminData.password || adminData.password.length < 12) {
      throw new Error('Password must be at least 12 characters long')
    }

    // 5. Pass customerId inside the payload to match test expectations
    return await this.customerRepository.assignAdmin(customerId, {
      ...adminData,
      customerId,
    })
  }
}