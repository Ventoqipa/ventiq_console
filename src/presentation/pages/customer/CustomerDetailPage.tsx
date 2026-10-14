import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Customer, CustomerStatus } from '../../../domain/customer/customer'
import { ClientAdmin } from '../../../domain/customer/clientAdmin'
import { HttpCustomerRepository } from '../../../infrastructure/repositories/httpCustomerRepository'
import { CustomerRepository } from '../../../application/ports/customerRepository.port'
import { UpdateCustomerStatusUseCase } from '../../../application/useCases/customer/updateCustomerStatus.usecase'
import { AssignClientAdminUseCase } from '../../../application/useCases/customer/assignClientAdmin.usecase'
import { DeleteCustomerUseCase } from '../../../application/useCases/customer/deleteCustomer.usecase'
import { DeleteCustomerUserUseCase } from '../../../application/useCases/customer/deleteCustomerUser.usecase'
import { ConfirmStatusModal } from '../../components/customer/ConfirmStatusModal'
import { AssignAdminModal } from '../../components/customer/AssignAdminModal'
import { ConfirmDeleteModal } from '../../components/customer/ConfirmDeleteModal'
import { useToast } from '../../context'

interface CustomerDetailPageProps {
  repository?: CustomerRepository
}

const defaultRepository = new HttpCustomerRepository()

export const CustomerDetailPage: React.FC<CustomerDetailPageProps> = ({
  repository = defaultRepository,
}) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [users, setUsers] = useState<ClientAdmin[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Status & Assign Modals state
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false)
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false)
  const [isAssigningAdmin, setIsAssigningAdmin] = useState<boolean>(false)

  // Delete Modals state
  const [isDeleteCustomerModalOpen, setIsDeleteCustomerModalOpen] = useState<boolean>(false)
  const [isDeletingCustomer, setIsDeletingCustomer] = useState<boolean>(false)
  const [userToDelete, setUserToDelete] = useState<ClientAdmin | null>(null)
  const [isDeletingUser, setIsDeletingUser] = useState<boolean>(false)

  const updateCustomerStatusUseCase = useMemo(
    () => new UpdateCustomerStatusUseCase(repository),
    [repository]
  )
  const assignClientAdminUseCase = useMemo(
    () => new AssignClientAdminUseCase(repository),
    [repository]
  )
  const deleteCustomerUseCase = useMemo(
    () => new DeleteCustomerUseCase(repository),
    [repository]
  )
  const deleteCustomerUserUseCase = useMemo(
    () => new DeleteCustomerUserUseCase(repository),
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
    } catch (err) {
      setCustomer(null)
      setUsers([])
      showToast(
        err instanceof Error ? err.message : 'Customer not found',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }, [id, repository, showToast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const currentStatus: CustomerStatus = customer?.status || 'ACTIVE'
  const targetStatus: CustomerStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'

  const handleStatusChange = async () => {
    if (!id || !customer) return
    setIsUpdatingStatus(true)

    try {
      await updateCustomerStatusUseCase.execute(id, targetStatus)
      // Re-obtenemos los datos para sincronizar cliente y usuarios
      await fetchData()
      setIsStatusModalOpen(false)
      const actionName = targetStatus === 'SUSPENDED' ? 'suspended' : 'activated'
      showToast(`${customer.name} was ${actionName} successfully!`, 'success')
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to update customer status.',
        'error'
      )
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleAssignAdmin = async (adminData: { fullName: string; email: string; password: string }) => {
    if (!id) return
    setIsAssigningAdmin(true)

    try {
      await assignClientAdminUseCase.execute(id, adminData)
      await fetchData()
      setIsAdminModalOpen(false)
      showToast('Client administrator assigned successfully!', 'success')
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to assign client admin.',
        'error'
      )
    } finally {
      setIsAssigningAdmin(false)
    }
  }

  const handleDeleteCustomer = async () => {
    if (!id || !customer) return
    setIsDeletingCustomer(true)

    try {
      await deleteCustomerUseCase.execute(id)
      setIsDeleteCustomerModalOpen(false)
      showToast(`${customer.name} was deleted successfully!`, 'success')
      navigate('/customers')
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to delete customer.',
        'error'
      )
    } finally {
      setIsDeletingCustomer(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!id || !userToDelete) return
    setIsDeletingUser(true)

    try {
      await deleteCustomerUserUseCase.execute(id, userToDelete.id)
      await fetchData()
      setUserToDelete(null)
      showToast(`User ${userToDelete.email} was deleted successfully!`, 'success')
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to delete user.',
        'error'
      )
    } finally {
      setIsDeletingUser(false)
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
  const hasAdmin = users.length > 0

  return (
    <div style={{ width: '100%', padding: '0.75rem 2rem', boxSizing: 'border-box' }}>
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

        <div style={{ display: 'flex', gap: '0.5rem' }}>
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

          <button
            type="button"
            onClick={() => setIsDeleteCustomerModalOpen(true)}
            style={{
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Delete Customer
          </button>
        </div>
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
              Tenant Administrator
            </h3>
          </div>

          {!hasAdmin && (
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
          )}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #f4f4f5', margin: '1rem 0' }} />

        {users.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {users.map((usr) => (
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
                    onClick={() => setUserToDelete(usr)}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#dc2626',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      padding: '0.3rem 0.6rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Delete User
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, color: '#71717a', fontSize: '0.875rem' }}>
            No admin user assigned for this organization yet.
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

      {/* Confirm Delete Customer Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteCustomerModalOpen}
        title="Delete Customer"
        description={
          <span>
            Are you sure you want to delete <strong>{customerName}</strong>? This action will permanently remove the customer, its users, and associated projects.
          </span>
        }
        loading={isDeletingCustomer}
        onClose={() => setIsDeleteCustomerModalOpen(false)}
        onConfirm={handleDeleteCustomer}
      />

      {/* Confirm Delete User Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(userToDelete)}
        title="Delete Client User"
        description={
          <span>
            Are you sure you want to delete user <strong>{userToDelete?.email}</strong>? You can assign a new administrator afterwards.
          </span>
        }
        loading={isDeletingUser}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteUser}
      />
    </div>
  )
}