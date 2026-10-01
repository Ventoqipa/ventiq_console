import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Customer } from '../../../domain/customer/customer'
import { HttpCustomerRepository } from '../../../infrastructure/repositories/httpCustomerRepository'

const customerRepository = new HttpCustomerRepository()

// Fallback mock dataset matching CustomerListPage ids
const MOCK_CUSTOMERS: Record<string, Customer> = {
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

export const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!id) return

    customerRepository
      .getById(id)
      .then((data) => {
        if (data) {
          setCustomer(data)
        } else if (MOCK_CUSTOMERS[id]) {
          setCustomer(MOCK_CUSTOMERS[id])
        }
      })
      .catch(() => {
        // Fallback to mock if API request fails
        if (MOCK_CUSTOMERS[id]) {
          setCustomer(MOCK_CUSTOMERS[id])
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  const renderStatusBadge = (status?: string) => {
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
          padding: '0.25rem 0.65rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 600,
          backgroundColor: bg,
          color: color,
        }}
      >
        {upper}
      </span>
    )
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#71717a' }}>
        Loading customer details...
      </div>
    )
  }

  const customerName = customer?.name || `Customer (${id})`

  return (
    <div>
      {/* Header with Back Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <button
          onClick={() => navigate('/customers')}
          style={{
            backgroundColor: '#18181b',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            fontSize: '0.825rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            marginTop: '1.25rem',
            transition: 'background-color 0.15s ease',
          }}
        >
          ← Back to Customers
        </button>
      </div>

      {/* Main Detail Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e4e4e7',
          padding: '1.75rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: '#71717a',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              CUSTOMER DETAILS
            </span>
            <h2
              style={{
                margin: '0.35rem 0 0.25rem 0',
                color: '#18181b',
                fontSize: '1.5rem',
                fontWeight: 700,
              }}
            >
              {customerName}
            </h2>
            <p
              style={{
                color: '#71717a',
                fontSize: '0.85rem',
                margin: 0,
              }}
            >
              Detailed information for tenant instance.
            </p>
          </div>
          {renderStatusBadge(customer?.status)}
        </div>

        <hr
          style={{
            border: 'none',
            borderTop: '1px solid #f4f4f5',
            margin: '1.25rem 0',
          }}
        />

        {/* Metadata Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
          }}
        >
          <div>
            <span
              style={{
                display: 'block',
                fontSize: '0.725rem',
                fontWeight: 600,
                color: '#a1a1aa',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.25rem',
              }}
            >
              CUSTOMER ID
            </span>
            <code
              style={{
                fontSize: '0.85rem',
                color: '#18181b',
                backgroundColor: '#f4f4f5',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontWeight: 500,
              }}
            >
              {id}
            </code>
          </div>

          <div>
            <span
              style={{
                display: 'block',
                fontSize: '0.725rem',
                fontWeight: 600,
                color: '#a1a1aa',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.25rem',
              }}
            >
              SLUG
            </span>
            <span
              style={{
                fontSize: '0.875rem',
                color: '#3f3f46',
                fontWeight: 500,
              }}
            >
              {customer?.slug || '—'}
            </span>
          </div>

          <div>
            <span
              style={{
                display: 'block',
                fontSize: '0.725rem',
                fontWeight: 600,
                color: '#a1a1aa',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.25rem',
              }}
            >
              CREATED AT
            </span>
            <span
              style={{
                fontSize: '0.875rem',
                color: '#3f3f46',
                fontWeight: 500,
              }}
            >
              {customer?.createdAt
                ? new Date(customer.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}