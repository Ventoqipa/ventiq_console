import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <button
        onClick={() => navigate('/customers')}
        style={{
          backgroundColor: '#f4f4f5',
          border: '1px solid #e4e4e7',
          padding: '0.4rem 0.8rem',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.825rem',
          fontWeight: 500,
          marginBottom: '1.5rem',
        }}
      >
        ← Volver a Customers
      </button>

      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e4e4e7',
          borderRadius: '8px',
          padding: '1.5rem',
        }}
      >
        <span
          style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            color: '#71717a',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          DETALLE DEL CLIENTE
        </span>
        <h2 style={{ margin: '0.5rem 0 1rem 0', color: '#18181b' }}>
          ID: {id}
        </h2>
        <p style={{ color: '#71717a', fontSize: '0.875rem' }}>
          Información detallada del tenant.
        </p>
      </div>
    </div>
  )
}