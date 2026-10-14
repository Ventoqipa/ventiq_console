import React, { useState, useCallback, useEffect, useRef } from 'react'
import { ToastContext, Toast } from './ToastContextInstance'

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const remainingTimeRef = useRef<number>(4000)
  const startTimeRef = useRef<number>(Date.now())

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now()
    timerRef.current = setTimeout(() => {
      onRemove(toast.id)
    }, remainingTimeRef.current)
  }, [toast.id, onRemove])

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
      remainingTimeRef.current -= Date.now() - startTimeRef.current
    }
  }, [])

  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [startTimer])

  const isError = toast.type === 'error'
  const isInfo = toast.type === 'info'

  const bgColor = isError ? '#fef2f2' : isInfo ? '#eff6ff' : '#f0fdf4'
  const borderColor = isError ? '#fecaca' : isInfo ? '#bfdbfe' : '#bbf7d0'
  const textColor = isError ? '#991b1b' : isInfo ? '#1e40af' : '#166534'

  return (
    <div
      role="status"
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
      onFocus={pauseTimer}
      onBlur={startTimer}
      style={{
        pointerEvents: 'auto',
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        color: textColor,
        padding: '0.75rem 1rem',
        borderRadius: '6px',
        fontSize: '0.875rem',
        fontWeight: 500,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.75rem',
        animation: 'fadeIn 0.2s ease-in-out',
      }}
    >
      <span>{toast.message}</span>
      <button
        type="button"
        onClick={() => onRemove(toast.id)}
        aria-label="Close notification"
        style={{
          background: 'none',
          border: 'none',
          color: textColor,
          cursor: 'pointer',
          fontSize: '1rem',
          lineHeight: 1,
          padding: 0,
          opacity: 0.7,
        }}
      >
        ×
      </button>
    </div>
  )
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div
        aria-live="polite"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          maxWidth: '380px',
          width: '100%',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}