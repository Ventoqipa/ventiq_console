import { CustomerRepository } from '../../application/ports/customerRepository.port'
import { Customer, CustomerStatus, CreateCustomerDTO } from '../../domain/customer/customer'
import { ClientAdmin } from '../../domain/customer/clientAdmin'
import { ApiClient } from '../api/apiClient'

const IS_MOCK_ENABLED = process.env.NODE_ENV === 'development'

const MOCK_CUSTOMERS_CACHE: Record<string, Customer> = {
  'cust-001': {
    id: 'cust-001',
    name: 'Acme Corporation',
    slug: 'acme-corp',
    status: 'ACTIVE',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  },
  'cust-002': {
    id: 'cust-002',
    name: 'Stark Industries',
    slug: 'stark-ind',
    status: 'SUSPENDED',
    createdAt: '2026-02-20T14:30:00Z',
    updatedAt: '2026-02-20T14:30:00Z',
  },
  'cust-003': {
    id: 'cust-003',
    name: 'Wayne Enterprises',
    slug: 'wayne-ent',
    status: 'ACTIVE',
    createdAt: '2026-03-05T09:15:00Z',
    updatedAt: '2026-03-05T09:15:00Z',
  },
}

const MOCK_ADMINS_CACHE: Record<string, ClientAdmin[]> = {}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Generates a collision-resistant customer ID by verifying existing cache keys.
 */
const generateUniqueCustomerId = (): string => {
  let customerNumber = Object.keys(MOCK_CUSTOMERS_CACHE).length
  let customerId: string
  do {
    customerNumber += 1
    customerId = `cust-${customerNumber.toString().padStart(3, '0')}`
  } while (MOCK_CUSTOMERS_CACHE[customerId])
  return customerId
}

export class HttpCustomerRepository implements CustomerRepository {
  async list(): Promise<Customer[]> {
    try {
      return await ApiClient.request<Customer[]>('/customers')
    } catch (error) {
      if (!IS_MOCK_ENABLED) {
        throw error
      }
      return Object.values(MOCK_CUSTOMERS_CACHE)
    }
  }

  async getById(id: string): Promise<Customer | null> {
    try {
      return await ApiClient.request<Customer>(`/customers/${id}`)
    } catch (error) {
      if (!IS_MOCK_ENABLED) {
        throw error
      }
      return MOCK_CUSTOMERS_CACHE[id] || null
    }
  }

  async create(data: CreateCustomerDTO): Promise<Customer> {
    try {
      return await ApiClient.request<Customer>('/customers', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    } catch (error) {
      if (!IS_MOCK_ENABLED) {
        throw error
      }

      const computedSlug =
        data.slug && data.slug.trim() !== ''
          ? data.slug
          : generateSlug(data.name)

      const newCustomer: Customer = {
        id: generateUniqueCustomerId(),
        name: data.name,
        slug: computedSlug,
        status: data.status || 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      MOCK_CUSTOMERS_CACHE[newCustomer.id] = newCustomer
      return newCustomer
    }
  }

  async updateStatus(id: string, status: CustomerStatus): Promise<Customer> {
    try {
      return await ApiClient.request<Customer>(`/customers/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
    } catch (error) {
      if (!IS_MOCK_ENABLED) {
        throw error
      }

      const existing = MOCK_CUSTOMERS_CACHE[id]
      if (!existing) {
        throw new Error(`Customer with ID "${id}" was not found in the mock cache.`)
      }

      const updatedCustomer: Customer = {
        ...existing,
        status,
        updatedAt: new Date().toISOString(),
      }

      MOCK_CUSTOMERS_CACHE[id] = updatedCustomer
      return updatedCustomer
    }
  }

  async assignAdmin(
    customerId: string,
    adminData: Omit<ClientAdmin, 'id' | 'createdAt'>,
  ): Promise<ClientAdmin> {
    try {
      const newAdmin = await ApiClient.request<ClientAdmin>(`/customers/${customerId}/admins`, {
        method: 'POST',
        body: JSON.stringify(adminData),
      })

      // Cache successful response so getAdminsByCustomerId retrieves it
      if (!MOCK_ADMINS_CACHE[customerId]) {
        MOCK_ADMINS_CACHE[customerId] = []
      }
      MOCK_ADMINS_CACHE[customerId].push(newAdmin)

      return newAdmin
    } catch (error) {
      if (!IS_MOCK_ENABLED) {
        throw error
      }

      const newAdmin: ClientAdmin = {
        id: `admin-${Date.now()}`,
        ...adminData,
        createdAt: new Date().toISOString(),
      }

      if (!MOCK_ADMINS_CACHE[customerId]) {
        MOCK_ADMINS_CACHE[customerId] = []
      }
      MOCK_ADMINS_CACHE[customerId].push(newAdmin)

      return newAdmin
    }
  }

  async getAdminsByCustomerId(customerId: string): Promise<ClientAdmin[]> {
    return MOCK_ADMINS_CACHE[customerId] || []
  }
}