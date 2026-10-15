import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DeleteCustomerUserUseCase } from './deleteCustomerUser.usecase'
import { CustomerRepository } from '../../ports/customerRepository.port'

describe('DeleteCustomerUserUseCase', () => {
  let repositoryMock: Partial<CustomerRepository>
  let useCase: DeleteCustomerUserUseCase

  beforeEach(() => {
    repositoryMock = {
      deleteCustomerUser: vi.fn().mockResolvedValue(undefined),
    }
    useCase = new DeleteCustomerUserUseCase(repositoryMock as CustomerRepository)
  })

  it('should throw error if customerId or userId is missing', async () => {
    await expect(useCase.execute('', 'user-1')).rejects.toThrow('Customer ID is required')
    await expect(useCase.execute('cust-1', '')).rejects.toThrow('User ID is required')
  })

  it('should call repository.deleteCustomerUser with valid parameters', async () => {
    await useCase.execute('cust-123', 'user-456')
    expect(repositoryMock.deleteCustomerUser).toHaveBeenCalledWith('cust-123', 'user-456')
  })
})