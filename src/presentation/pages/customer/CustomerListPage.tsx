import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Customer } from '../../../domain/customer/customer'
import { HttpCustomerRepository } from '../../../infrastructure/repositories/httpCustomerRepository'
import { GetCustomersUseCase } from '../../../application/useCases/customer/getCustomers.usecase'

const customerRepository = new HttpCustomerRepository()
const getCustomersUseCase = new GetCustomersUseCase(customerRepository)

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
  const navigate = useNavigate()

  useEffect(() => {
    getCustomersUseCase
      .execute()
      .then((data) => setCustomers(data))
      .catch(() => {
        setError('Failed to load customers from server.')
        setCustomers(MOCK_CUSTOMERS) // Fallback to mock data for presentation
      })
      .finally(() => setLoading(false))
  }, [])

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
            ) : customers.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    padding: '2.5rem',
                    textAlign: 'center',
                    color: '#a1a1aa',
                  }}
                >
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
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
    </div>
  )
}