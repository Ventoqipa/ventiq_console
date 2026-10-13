import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Customer, CustomerStatus } from '../../../domain/customer/customer'
import { ClientAdmin } from '../../../domain/customer/clientAdmin'
import { HttpCustomerRepository } from '../../../infrastructure/repositories/httpCustomerRepository'
import { CustomerRepository } from '../../../application/ports/customerRepository.port'
import { UpdateCustomerStatusUseCase } from '../../../application/useCases/customer/updateCustomerStatus.usecase'
import { UpdateCustomerUserStatusUseCase } from '../../../application/useCases/customer/updateCustomerUserStatus.usecase'
import { AssignClientAdminUseCase } from '../../../application/useCases/customer/assignClientAdmin.usecase'
import { ConfirmStatusModal } from '../../components/customer/ConfirmStatusModal'
import { AssignAdminModal } from '../../components/customer/AssignAdminModal'

interface CustomerDetailPageProps {
  repository?: CustomerRepository
}

const defaultRepository = new HttpCustomerRepository()

export const CustomerDetailPage: React.FC<CustomerDetailPageProps> = ({
  repository = defaultRepository,
}) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [users, setUsers] = useState<ClientAdmin[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Modals state
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false)
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false)
  const [isAssigningAdmin, setIsAssigningAdmin] = useState<boolean>(false)

  // User status update state
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Memoise use cases to prevent re-instantiation on every render
  const updateCustomerStatusUseCase = useMemo(
    () => new UpdateCustomerStatusUseCase(repository),
    [repository]
  )
  const updateUserStatusUseCase = useMemo(
    () => new UpdateCustomerUserStatusUseCase(repository),
    [repository]
  )
  const assignClientAdminUseCase = useMemo(
    () => new AssignClientAdminUseCase(repository),
    [repository]
  )

  const fetchData = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      const data = await repository.getById(id)
      setCustomer(data)

      if (data) {
        const adminList = await repository.getAdminsByCustomerId(id)
        setUsers(adminList)
      } else {
        setUsers([])
      }
    } catch {
      setCustomer(null)
      setUsers([])
      setErrorMessage('Failed to load customer details.')
    } finally {
      setLoading(false)
    }
  }, [id, repository])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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

  const handleToggleUserStatus = async (user: ClientAdmin) => {
    if (!id) return
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'

    try {
      setUpdatingUserId(user.id)
      setErrorMessage(null)
      await updateUserStatusUseCase.execute(id, user.id, newStatus)
      await fetchData()
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update user status.')
    } finally {
      setUpdatingUserId(null)
    }
  }

  const handleAssignAdmin = async (adminData: { fullName: string; email: string; password: string }) => {
    if (!id) return
    setIsAssigningAdmin(true)
    setErrorMessage(null)

    try {
      await assignClientAdminUseCase.execute(id, adminData)
      await fetchData()
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
    } else if (upper === 'SUSPENDED' || upper === 'INACTIVE') {
      bg = '#fee2e2'
      color = '#991b1b'
    } else if (upper === 'PENDING') {
      bg = '#fef3c7'
      color = '#92400e'
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

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    const parsedDate = new Date(dateStr)
    if (isNaN(parsedDate.getTime())) return '—'
    return parsedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    })
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
            <p style={{ color: '#52525b', fontSize: '0.85rem', margin: 0 }}>
              Detailed information for tenant instance.
            </p>
          </div>
          {renderStatusBadge(customer?.status)}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #f4f4f5', margin: '1.25rem 0' }} />

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
                display: 'inline-block',
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
            <code
              style={{
                fontSize: '0.85rem',
                color: '#18181b',
                backgroundColor: '#f4f4f5',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontWeight: 500,
                display: 'inline-block',
              }}
            >
              {customer?.slug || '—'}
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
              CREATED AT
            </span>
            <code
              style={{
                fontSize: '0.85rem',
                color: '#18181b',
                backgroundColor: '#f4f4f5',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontWeight: 500,
                display: 'inline-block',
              }}
            >
              {formatDate(customer?.createdAt)}
            </code>
          </div>
        </div>
      </div>

      {/* Client Users Section */}
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
              CLIENT USERS
            </span>
            <h3 style={{ margin: '0.2rem 0 0 0', color: '#18181b', fontSize: '1.125rem', fontWeight: 700 }}>
              Tenant Users & Administrators
            </h3>
          </div>

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
            + Assign User
          </button>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #f4f4f5', margin: '1rem 0' }} />

        {users.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {users.map((usr) => {
              const isUserActive = usr.status === 'ACTIVE'
              const isUpdatingThisUser = updatingUserId === usr.id

              return (
                <div
                  key={usr.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.85rem 1rem',
                    border: '1px solid #e4e4e7',
                    borderRadius: '6px',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.875rem', color: '#18181b' }}>
                      {usr.fullName || usr.email}
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: '#71717a' }}>{usr.email}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {renderStatusBadge(usr.status || 'ACTIVE')}

                    <button
                      type="button"
                      disabled={isUpdatingThisUser}
                      onClick={() => handleToggleUserStatus(usr)}
                      style={{
                        backgroundColor: isUserActive ? '#ffffff' : '#15803d',
                        color: isUserActive ? '#dc2626' : '#ffffff',
                        border: `1px solid ${isUserActive ? '#fecaca' : '#15803d'}`,
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.775rem',
                        fontWeight: 600,
                        cursor: isUpdatingThisUser ? 'not-allowed' : 'pointer',
                        opacity: isUpdatingThisUser ? 0.6 : 1,
                      }}
                    >
                      {isUpdatingThisUser
                        ? 'Updating...'
                        : isUserActive
                        ? 'Suspend'
                        : 'Activate'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p style={{ margin: 0, color: '#71717a', fontSize: '0.875rem' }}>
            No users registered for this organization yet.
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