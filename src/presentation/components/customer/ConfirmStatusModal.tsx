import React from 'react'
import { CustomerStatus } from '../../../domain/customer/customer'

interface ConfirmStatusModalProps {
  isOpen: boolean
  customerName: string
  targetStatus: CustomerStatus
  loading: boolean
  onClose: () => void
  onConfirm: () => void
}

export const ConfirmStatusModal: React.FC<ConfirmStatusModalProps> = ({
  isOpen,
  customerName,
  targetStatus,
  loading,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null

  const isSuspending = targetStatus === 'SUSPENDED'
  const actionText = isSuspending ? 'Suspend' : 'Activate'

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e4e4e7',
          padding: '1.5rem',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3
          style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#18181b',
            marginTop: 0,
            marginBottom: '0.5rem',
          }}
        >
          {actionText} Customer Access
        </h3>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#52525b',
            marginBottom: '1.5rem',
            lineHeight: '1.4',
          }}
        >
          Are you sure you want to {actionText.toLowerCase()}{' '}
          <strong>{customerName}</strong>?{' '}
          {isSuspending
            ? 'This will temporarily restrict tenant access.'
            : 'This will restore full tenant access.'}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              backgroundColor: '#ffffff',
              color: '#3f3f46',
              border: '1px solid #d4d4d8',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              backgroundColor: isSuspending ? '#dc2626' : '#18181b',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Updating...' : `Yes, ${actionText}`}
          </button>
        </div>
      </div>
    </div>
  )
}