import React, { useEffect, useRef, useState } from 'react'

interface AssignAdminModalProps {
  isOpen: boolean
  customerName: string
  loading: boolean
  onClose: () => void
  onConfirm: (adminData: { fullName: string; email: string; role: 'ADMIN' | 'OWNER' }) => void
}

export const AssignAdminModal: React.FC<AssignAdminModalProps> = ({
  isOpen,
  customerName,
  loading,
  onClose,
  onConfirm,
}) => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'ADMIN' | 'OWNER'>('ADMIN')
  const [error, setError] = useState<string | null>(null)

  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    // Save previously focused element to restore it on close
    previousFocusRef.current = document.activeElement as HTMLElement

    // Focus first interactive element in modal
    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusableElements && focusableElements.length > 0) {
      focusableElements[0].focus()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) {
        onClose()
        return
      }

      // Keep focus trapped within modal overlay
      if (event.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
        )
        if (focusables.length === 0) return

        const firstElement = focusables[0]
        const lastElement = focusables[focusables.length - 1]

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen, loading, onClose])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim()) {
      setError('Full name is required')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim() || !emailRegex.test(email)) {
      setError('A valid email address is required')
      return
    }

    setError(null)
    onConfirm({ fullName, email, role })
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="assign-admin-modal-title"
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
        ref={modalRef}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '1.5rem',
          maxWidth: '450px',
          width: '100%',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3
          id="assign-admin-modal-title"
          style={{ margin: '0 0 0.5rem 0', color: '#18181b', fontSize: '1.25rem' }}
        >
          Assign Client Admin
        </h3>
        <p style={{ margin: '0 0 1rem 0', color: '#71717a', fontSize: '0.875rem' }}>
          Set up the primary administrator for <strong>{customerName}</strong>.
        </p>

        {error && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.825rem',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="client-admin-name"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#3f3f46',
                marginBottom: '0.25rem',
                textTransform: 'uppercase',
              }}
            >
              Full Name
            </label>
            <input
              id="client-admin-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Sarah Connor"
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #d4d4d8',
                fontSize: '0.875rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="client-admin-email"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#3f3f46',
                marginBottom: '0.25rem',
                textTransform: 'uppercase',
              }}
            >
              Email Address
            </label>
            <input
              id="client-admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sarah@acme.com"
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #d4d4d8',
                fontSize: '0.875rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="client-admin-role"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#3f3f46',
                marginBottom: '0.25rem',
                textTransform: 'uppercase',
              }}
            >
              Role
            </label>
            <select
              id="client-admin-role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'ADMIN' | 'OWNER')}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #d4d4d8',
                fontSize: '0.875rem',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff',
              }}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="OWNER">OWNER</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #d4d4d8',
                color: '#3f3f46',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#18181b',
                color: '#ffffff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {loading ? 'Assigning...' : 'Assign Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}