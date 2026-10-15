import React, { useEffect, useRef } from 'react'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  title: string
  description: React.ReactNode
  loading: boolean
  onClose: () => void
  onConfirm: () => void
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  description,
  loading,
  onClose,
  onConfirm,
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // 1. Efecto dedicado EXCLUSIVAMENTE a guardar y restaurar el foco al abrir y cerrar el modal
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
    } else {
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen])

  // Restauración de seguridad al desmontar el componente si estaba abierto
  useEffect(() => {
    return () => {
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus()
      }
    }
  }, [])

  // 2. Efecto para manejar el foco inicial y las interacciones de teclado (Escape / Tab)
  useEffect(() => {
    if (!isOpen) return

    // Enfocar el primer elemento no deshabilitado o el contenedor del modal si todos están deshabilitados
    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    )
    if (focusableElements && focusableElements.length > 0) {
      focusableElements[0].focus()
    } else {
      modalRef.current?.focus()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) {
        onClose()
        return
      }

      if (event.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
        )

        // Si los botones están deshabilitados durante el loading, mantener el foco atrapado en el contenedor del modal
        if (focusables.length === 0) {
          event.preventDefault()
          modalRef.current.focus()
          return
        }

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
    }
  }, [isOpen, loading, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-modal-title"
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
        tabIndex={-1}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e4e4e7',
          padding: '1.5rem',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          outline: 'none',
        }}
      >
        <h3
          id="confirm-delete-modal-title"
          style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#991b1b',
            marginTop: 0,
            marginBottom: '0.5rem',
          }}
        >
          {title}
        </h3>
        <div
          style={{
            fontSize: '0.875rem',
            color: '#52525b',
            marginBottom: '1.5rem',
            lineHeight: '1.4',
          }}
        >
          {description}
        </div>

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
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}