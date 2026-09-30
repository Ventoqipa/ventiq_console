import { CustomerRepository } from '../../ports/customerRepository.port'
import { Customer } from '../../../domain/customer/customer'

export class GetCustomersUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(): Promise<Customer[]> {
    return this.customerRepository.list()
  }
}