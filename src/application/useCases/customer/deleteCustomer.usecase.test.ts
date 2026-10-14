import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DeleteCustomerUseCase } from './deleteCustomer.usecase'
import { CustomerRepository } from '../../ports/customerRepository.port'

describe('DeleteCustomerUseCase', () => {
  let repositoryMock: Partial<CustomerRepository>
  let useCase: DeleteCustomerUseCase

  beforeEach(() => {
    repositoryMock = {
      deleteCustomer: vi.fn().mockResolvedValue(undefined),
    }
    useCase = new DeleteCustomerUseCase(repositoryMock as CustomerRepository)
  })

  it('should throw an error if customerId is empty', async () => {
    await expect(useCase.execute('')).rejects.toThrow('Customer ID is required')
  })

  it('should call repository.deleteCustomer with valid customerId', async () => {
    await useCase.execute('cust-123')
    expect(repositoryMock.deleteCustomer).toHaveBeenCalledWith('cust-123')
  })
})