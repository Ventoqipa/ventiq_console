import { CustomerRepository } from '../../application/ports/customerRepository.port'
import { Customer, CustomerStatus, CreateCustomerDTO } from '../../domain/customer/customer'
import { ClientAdmin, AssignAdminDTO } from '../../domain/customer/clientAdmin'
import { ApiClient } from '../api/apiClient'

interface PaginatedResponse<T> {
  data?: T[]
  items?: T[]
  content?: T[]
}

interface RawCustomer {
  id: string
  name: string
  slug?: string
  status?: CustomerStatus
  createdAt?: string
  updatedAt?: string
}

interface RawUser {
  id: string
  fullName?: string
  email: string
  role?: string
  status?: 'ACTIVE' | 'SUSPENDED'
  createdAt?: string
}

/**
 * Helper function to generate a readable slug from customer name
 */
function generateSlug(name: string): string {
  if (!name) return ''
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export class HttpCustomerRepository implements CustomerRepository {
  async list(): Promise<Customer[]> {
    const response = await ApiClient.get<RawCustomer[] | PaginatedResponse<RawCustomer>>('/admin/customers')
    let rawCustomers: RawCustomer[] = []

    if (Array.isArray(response)) {
      rawCustomers = response
    } else if (response && typeof response === 'object') {
      rawCustomers = response.data || response.items || response.content || []
    }

    return rawCustomers.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug || generateSlug(c.name) || c.id,
      status: c.status || 'PENDING',
      createdAt: c.createdAt || '',
      updatedAt: c.updatedAt || '',
    }))
  }

  async getById(id: string): Promise<Customer | null> {
    const customer = await ApiClient.get<RawCustomer>(`/admin/customers/${id}`)
    if (!customer) return null

    return {
      id: customer.id,
      name: customer.name,
      slug: customer.slug || generateSlug(customer.name) || customer.id,
      status: customer.status || 'PENDING',
      createdAt: customer.createdAt || '',
      updatedAt: customer.updatedAt || '',
    }
  }

  async create(data: CreateCustomerDTO): Promise<Customer> {
    // Railway API strictly requires { "name": "..." }
    const created = await ApiClient.post<RawCustomer>('/admin/customers', {
      name: data.name,
    })

    return {
      id: created.id,
      name: created.name,
      slug: created.slug || generateSlug(created.name) || created.id,
      status: created.status || 'PENDING',
      createdAt: created.createdAt || '',
      updatedAt: created.updatedAt || '',
    }
  }

  async updateStatus(id: string, status: CustomerStatus): Promise<Customer> {
    const updated = await ApiClient.patch<RawCustomer>(`/admin/customers/${id}/status`, { status })
    return {
      id: updated.id,
      name: updated.name,
      slug: updated.slug || generateSlug(updated.name) || updated.id,
      status: updated.status || status,
      createdAt: updated.createdAt || '',
      updatedAt: updated.updatedAt || '',
    }
  }

  async assignAdmin(
    customerId: string,
    adminData: AssignAdminDTO,
  ): Promise<ClientAdmin> {
    // Railway API strictly requires { "email", "password" }
    const payload = {
      email: adminData.email,
      password: adminData.password || 'VentiqSecureAdmin2026!',
    }

    const response = await ApiClient.post<RawUser>(
      `/admin/customers/${customerId}/users`,
      payload
    )

    return {
      id: response.id || 'usr_' + Date.now(),
      fullName: adminData.fullName || response.email?.split('@')[0] || 'Admin User',
      email: response.email || adminData.email,
      role: response.role || 'ADMIN',
      status: response.status || 'ACTIVE',
      createdAt: response.createdAt || new Date().toISOString(),
    }
  }

  async getAdminsByCustomerId(customerId: string): Promise<ClientAdmin[]> {
    const response = await ApiClient.get<RawUser[] | PaginatedResponse<RawUser>>(`/admin/customers/${customerId}/users`)
    let rawUsers: RawUser[] = []

    if (Array.isArray(response)) {
      rawUsers = response
    } else if (response && typeof response === 'object') {
      rawUsers = response.data || response.items || response.content || []
    }

    return rawUsers.map((u) => ({
      id: u.id,
      fullName: u.fullName || u.email?.split('@')[0] || 'Admin User',
      email: u.email,
      role: u.role || 'ADMIN',
      status: u.status || 'ACTIVE',
      createdAt: u.createdAt || new Date().toISOString(),
    }))
  }

  async updateUserStatus(
    customerId: string,
    userId: string,
    status: 'ACTIVE' | 'SUSPENDED'
  ): Promise<ClientAdmin> {
    const response = await ApiClient.patch<RawUser>(
      `/admin/customers/${customerId}/users/${userId}/status`,
      { status }
    )

    return {
      id: response.id || userId,
      fullName: response.fullName || response.email?.split('@')[0] || 'Admin User',
      email: response.email,
      role: response.role || 'ADMIN',
      status: response.status || status,
      createdAt: response.createdAt || '',
    }
  }
}