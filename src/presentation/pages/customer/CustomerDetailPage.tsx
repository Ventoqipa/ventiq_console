import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Customer, CustomerStatus } from '../../../domain/customer/customer'
import { ClientAdmin } from '../../../domain/customer/clientAdmin'
import { HttpCustomerRepository } from '../../../infrastructure/repositories/httpCustomerRepository'
import { UpdateCustomerStatusUseCase } from '../../../application/useCases/customer/updateCustomerStatus.usecase'
import { AssignClientAdminUseCase } from '../../../application/useCases/customer/assignClientAdmin.usecase'
import { ConfirmStatusModal } from '../../components/customer/ConfirmStatusModal'
import { AssignAdminModal } from '../../components/customer/AssignAdminModal'

const customerRepository = new HttpCustomerRepository()
const updateCustomerStatusUseCase = new UpdateCustomerStatusUseCase(customerRepository)
const assignClientAdminUseCase = new AssignClientAdminUseCase(customerRepository)

export const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [admin, setAdmin] = useState<ClientAdmin | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Status modal state
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false)

  // Assign Admin modal state
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false)
  const [isAssigningAdmin, setIsAssigningAdmin] = useState<boolean>(false)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await customerRepository.getById(id)
        setCustomer(data)

        if (data) {
          const admins = await customerRepository.getAdminsByCustomerId(id)
          setAdmin(admins[0] ?? null)
        } else {
          setAdmin(null)
        }
      } catch {
        // Clear customer and admin state on route lookup failure
        setCustomer(null)
        setAdmin(null)
        setErrorMessage('Failed to load customer details.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const currentStatus: CustomerStatus = customer?.status || 'ACTIVE'
  const targetStatus: CustomerStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'

  const handleStatusChange = async () => {
    if (!id) return
    setIsUpdatingStatus(true)
    setErrorMessage(null)

    try {
      const updatedCustomer = await updateCustomerStatusUseCase.execute(id, targetStatus)
      setCustomer(updatedCustomer)
      setIsStatusModalOpen(false)
    } catch {
      setErrorMessage('Failed to update customer status. Please try again.')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleAssignAdmin = async (adminData: { fullName: string; email: string; role: 'ADMIN' | 'OWNER' }) => {
    if (!id) return
    setIsAssigningAdmin(true)
    setErrorMessage(null)

    try {
      const newAdmin = await assignClientAdminUseCase.execute(id, adminData)
      setAdmin(newAdmin)
      setIsAdminModalOpen(false)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to assign client admin.')
    } finally {
      setIsAssigningAdmin(false)
    }
  }

  const renderStatusBadge = (status?: string) => {
    const upper = status?.toUpperCase() || 'UNKNOWN'
    let bg = '#f4f4f5'
    let color = '#52525b'

    if (upper === 'ACTIVE') {
      bg = '#dcfce7'
      color = '#14532d'
    } else if (upper === 'SUSPENDED') {
      bg = '#fee2e2'
      color = '#991b1b'
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
      {/* Error Banner */}
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

      {/* Header Actions */}
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
          onClick={() => setIsStatusModalOpen(true)}
          style={{
            backgroundColor: currentStatus === 'ACTIVE' ? '#b91c1c' : '#15803d',
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

      {/* Main Details Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e4e4e7',
          padding: '1.75rem',
          marginBottom: '1.5rem',
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
                color: '#52525b',
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

      {/* Primary Client Admin Card */}
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
            alignItems: 'center',
            marginBottom: '1rem',
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
              PRIMARY CLIENT ADMIN
            </span>
            <h3
              style={{
                margin: '0.2rem 0 0 0',
                color: '#18181b',
                fontSize: '1.125rem',
                fontWeight: 700,
              }}
            >
              Tenant Administrator
            </h3>
          </div>

          {!admin && (
            <button
              type="button"
              onClick={() => setIsAdminModalOpen(true)}
              style={{
                backgroundColor: '#18181b',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Assign Admin
            </button>
          )}
        </div>

        <hr
          style={{
            border: 'none',
            borderTop: '1px solid #f4f4f5',
            margin: '1rem 0',
          }}
        />

        {admin ? (
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
                NAME
              </span>
              <strong style={{ fontSize: '0.875rem', color: '#18181b' }}>
                {admin.fullName}
              </strong>
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
                EMAIL
              </span>
              <span style={{ fontSize: '0.875rem', color: '#3f3f46' }}>{admin.email}</span>
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
                ROLE
              </span>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: '#f4f4f5',
                  color: '#3f3f46',
                }}
              >
                {admin.role}
              </span>
            </div>
          </div>
        ) : (
          <p style={{ margin: 0, color: '#71717a', fontSize: '0.875rem' }}>
            No admin assigned yet for this organization.
          </p>
        )}
      </div>

      {/* Confirm Status Modal */}
      <ConfirmStatusModal
        isOpen={isStatusModalOpen}
        customerName={customerName}
        targetStatus={targetStatus}
        loading={isUpdatingStatus}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={handleStatusChange}
      />

      {/* Assign Client Admin Modal */}
      <AssignAdminModal
        isOpen={isAdminModalOpen}
        customerName={customerName}
        loading={isAssigningAdmin}
        onClose={() => setIsAdminModalOpen(false)}
        onConfirm={handleAssignAdmin}
      />
    </div>
  )
}