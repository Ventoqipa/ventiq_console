import { CustomerRepository } from '../../ports/customerRepository.port'
import { Customer, CreateCustomerDTO } from '../../../domain/customer/customer'

export class CreateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(data: CreateCustomerDTO): Promise<Customer> {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Customer name is required')
    }

    return await this.customerRepository.create(data)
  }
}