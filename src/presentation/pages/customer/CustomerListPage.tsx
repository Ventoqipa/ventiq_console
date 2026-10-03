import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Customer, CreateCustomerDTO, CustomerStatus } from '../../../domain/customer/customer'
import { HttpCustomerRepository } from '../../../infrastructure/repositories/httpCustomerRepository'
import { GetCustomersUseCase } from '../../../application/useCases/customer/getCustomers.usecase'
import { CreateCustomerUseCase } from '../../../application/useCases/customer/createCustomer.usecase'
import { CreateCustomerModal } from '../../components/customer/CreateCustomerModal'

const customerRepository = new HttpCustomerRepository()
const getCustomersUseCase = new GetCustomersUseCase(customerRepository)
const createCustomerUseCase = new CreateCustomerUseCase(customerRepository)

// Fallback mock data in case backend API is not available
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-001',
    name: 'Acme Corporation',
    slug: 'acme-corp',
    status: 'ACTIVE',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'cust-002',
    name: 'Stark Industries',
    slug: 'stark-ind',
    status: 'SUSPENDED',
    createdAt: '2026-02-20T14:30:00Z',
    updatedAt: '2026-02-20T14:30:00Z',
  },
  {
    id: 'cust-003',
    name: 'Wayne Enterprises',
    slug: 'wayne-ent',
    status: 'ACTIVE',
    createdAt: '2026-03-05T09:15:00Z',
    updatedAt: '2026-03-05T09:15:00Z',
  },
]

export const CustomerListPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  // Filter States
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | 'ALL'>('ALL')

  const navigate = useNavigate()

  const fetchCustomers = () => {
    setLoading(true)
    getCustomersUseCase
      .execute()
      .then((data) => {
        setCustomers(data)
        setError(null)
      })
      .catch(() => {
        setError('Failed to load customers from server.')
        setCustomers(MOCK_CUSTOMERS) // Fallback to mock data for presentation
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  // Reactive UI Filtering
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchLower = searchTerm.toLowerCase().trim()
      const matchesSearch =
        !searchLower ||
        customer.name.toLowerCase().includes(searchLower) ||
        (customer.slug?.toLowerCase().includes(searchLower) ?? false)

      const matchesStatus = statusFilter === 'ALL' || customer.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [customers, searchTerm, statusFilter])

  const handleResetFilters = () => {
    setSearchTerm('')
    setStatusFilter('ALL')
  }

  const hasActiveFilters = searchTerm.trim() !== '' || statusFilter !== 'ALL'

  const handleCreateCustomer = async (data: CreateCustomerDTO) => {
    try {
      const created = await createCustomerUseCase.execute(data)
      setCustomers((prev) => [created, ...prev])
    } catch {
      const newMockCustomer: Customer = {
        id: `cust-${Date.now()}`,
        name: data.name,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
        status: data.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setCustomers((prev) => [newMockCustomer, ...prev])
    }
  }

  const renderStatusBadge = (status: string) => {
    const upper = status?.toUpperCase() || 'UNKNOWN'

    let bg = '#f4f4f5'
    let color = '#71717a'

    if (upper === 'ACTIVE') {
      bg = '#ecfdf5'
      color = '#059669'
    } else if (upper === 'SUSPENDED') {
      bg = '#fef2f2'
      color = '#dc2626'
    } else if (upper === 'PAUSED') {
      bg = '#fffbebe'
      color = '#d97706'
    }

    return (
      <span
        style={{
          display: 'inline-block',
          padding: '0.2rem 0.55rem',
          borderRadius: '9999px',
          fontSize: '0.725rem',
          fontWeight: 600,
          backgroundColor: bg,
          color: color,
        }}
      >
        {upper}
      </span>
    )
  }

  return (
    <div>
      {/* Page Header and Main Action */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h2
          style={{
            fontSize: '1.35rem',
            fontWeight: 700,
            color: '#18181b',
            margin: 0,
          }}
        >
          Customers
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: '#18181b',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            fontSize: '0.825rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + New Customer
        </button>
      </div>

      {/* Control Bar: Search and Filters */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          role="searchbox"
          aria-label="Search customers by company name or slug"
          placeholder="Search by company name or slug..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid #d4d4d8',
            fontSize: '0.85rem',
            minWidth: '260px',
            outline: 'none',
          }}
        />

        <select
          role="combobox"
          aria-label="Filter customers by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as CustomerStatus | 'ALL')}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid #d4d4d8',
            fontSize: '0.85rem',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
          }}
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="SUSPENDED">SUSPENDED</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '6px',
              border: '1px solid #d4d4d8',
              backgroundColor: '#f4f4f5',
              color: '#3f3f46',
              fontSize: '0.825rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Warning Alert Banner when API fails */}
      {error && (
        <div
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            fontSize: '0.825rem',
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>⚠️ {error}</span>
          <span style={{ fontSize: '0.75rem', color: '#b91c1c' }}>
            (Using fallback demo data)
          </span>
        </div>
      )}

      {/* Customers Data Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e4e4e7',
          overflow: 'hidden',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.875rem',
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: '1px solid #e4e4e7',
                backgroundColor: '#fafafa',
              }}
            >
              <th
                style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#71717a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                NAME
              </th>
              <th
                style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#71717a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                SLUG
              </th>
              <th
                style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#71717a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                STATUS
              </th>
              <th
                style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#71717a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                CREATION DATE
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    padding: '2.5rem',
                    textAlign: 'center',
                    color: '#71717a',
                  }}
                >
                  Loading customers...
                </td>
              </tr>
            ) : filteredCustomers.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    padding: '3rem 1rem',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ color: '#71717a', fontSize: '0.875rem' }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>
                      No customers found
                    </p>
                    <p style={{ margin: '0 0 1rem 0', color: '#a1a1aa', fontSize: '0.8rem' }}>
                      {hasActiveFilters
                        ? 'No tenants match your current search or status criteria.'
                        : 'There are no registered customers yet.'}
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={handleResetFilters}
                        style={{
                          backgroundColor: '#18181b',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.4rem 0.85rem',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/customers/${c.id}`)}
                  style={{
                    borderBottom: '1px solid #f4f4f5',
                    cursor: 'pointer',
                  }}
                >
                  <td
                    style={{
                      padding: '0.85rem 1rem',
                      fontWeight: 600,
                      color: '#18181b',
                    }}
                  >
                    {c.name}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <code
                      style={{
                        fontSize: '0.8rem',
                        color: '#52525b',
                        backgroundColor: '#f4f4f5',
                        padding: '0.15rem 0.4rem',
                        borderRadius: '4px',
                      }}
                    >
                      {c.slug || c.id}
                    </code>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {renderStatusBadge(c.status)}
                  </td>
                  <td
                    style={{
                      padding: '0.85rem 1rem',
                      color: '#52525b',
                      fontSize: '0.8rem',
                    }}
                  >
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString()
                      : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Creation Modal */}
      <CreateCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCustomer}
      />
    </div>
  )
}