import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Customer, CustomerStatus } from '../../../domain/customer/customer'
import { HttpCustomerRepository } from '../../../infrastructure/repositories/httpCustomerRepository'
import { UpdateCustomerStatusUseCase } from '../../../application/useCases/customer/updateCustomerStatus.usecase'
import { ConfirmStatusModal } from '../../components/customer/ConfirmStatusModal'

const customerRepository = new HttpCustomerRepository()
const updateCustomerStatusUseCase = new UpdateCustomerStatusUseCase(customerRepository)

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

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
        if (MOCK_CUSTOMERS[id]) {
          setCustomer(MOCK_CUSTOMERS[id])
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  const currentStatus: CustomerStatus = customer?.status || 'ACTIVE'
  const targetStatus: CustomerStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'

  const handleStatusChange = async () => {
    if (!id) return
    setIsUpdating(true)
    setErrorMessage(null)

    try {
      const updatedCustomer = await updateCustomerStatusUseCase.execute(id, targetStatus)
      setCustomer(updatedCustomer)
      setIsModalOpen(false)
    } catch {
      setErrorMessage('Failed to update customer status. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const renderStatusBadge = (status?: string) => {
    const upper = status?.toUpperCase() || 'UNKNOWN'
    let bg = '#f4f4f5'
    let color = '#52525b' // High contrast neutral

    if (upper === 'ACTIVE') {
      bg = '#dcfce7'
      color = '#14532d' // Enhanced contrast green (WCAG AAA/AA compliant)
    } else if (upper === 'SUSPENDED') {
      bg = '#fee2e2'
      color = '#991b1b' // Enhanced contrast red (WCAG AAA/AA compliant)
    }

    return (
      <span
        aria-label={`Status: ${upper}`}
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
      <div role="status" style={{ padding: '2rem', textAlign: 'center', color: '#52525b' }}>
        Loading customer details...
      </div>
    )
  }

  const customerName = customer?.name || `Customer (${id})`

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Banner de error */}
      {errorMessage && (
        <div
          role="alert"
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            fontSize: '0.875rem',
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* Encabezado con Botones */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <button
          type="button"
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
            transition: 'background-color 0.15s ease',
          }}
        >
          ← Back to Customers
        </button>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: currentStatus === 'ACTIVE' ? '#b91c1c' : '#15803d', // Adjusted for >= 4.5:1 contrast
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            fontSize: '0.825rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'opacity 0.15s ease',
          }}
        >
          {currentStatus === 'ACTIVE' ? 'Suspend Customer' : 'Activate Customer'}
        </button>
      </div>

      {/* Tarjeta principal */}
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
                color: '#52525b', // High-contrast label
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
                color: '#52525b',
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

        {/* Malla de Metadatos */}
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
                color: '#52525b',
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
                color: '#52525b',
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
                color: '#18181b',
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
                color: '#52525b',
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
                color: '#18181b',
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

      {/* Modal de Confirmación */}
      <ConfirmStatusModal
        isOpen={isModalOpen}
        customerName={customerName}
        targetStatus={targetStatus}
        loading={isUpdating}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleStatusChange}
      />
    </div>
  )
}