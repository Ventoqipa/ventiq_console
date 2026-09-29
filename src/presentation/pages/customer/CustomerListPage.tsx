import React, { useEffect, useState } from 'react'
import { Customer } from '../../../domain/customer/customer'
import { ApiCustomerRepository } from '../../../infrastructure/repositories/apiCustomerRepository'
import { GetCustomersUseCase } from '../../../application/useCases/customer/getCustomers.usecase'

const customerRepository = new ApiCustomerRepository()
const getCustomersUseCase = new GetCustomersUseCase(customerRepository)

export const CustomerListPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getCustomersUseCase
      .execute()
      .then((data) => setCustomers(data))
      .catch(() => setError('Failed to load customers.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ color: '#71717a', fontSize: '0.875rem' }}>Cargando clientes...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</div>

  return (
    <div>
      {/* Header de la Página y Botón de Acción */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#18181b', margin: 0 }}>
          Customers
        </h2>
        <button
          style={{
            backgroundColor: '#18181b',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            fontSize: '0.825rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          + Nuevo Customer
        </button>
      </div>

      {/* Contenedor de la Tabla - Estilo Wireframe */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e4e4e7', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e4e4e7', backgroundColor: '#fafafa' }}>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                NOMBRE
              </th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                RAZÓN SOCIAL
              </th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                TAX ID / RFC
              </th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ESTADO
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#a1a1aa' }}>
                  No hay clientes registrados.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f4f4f5' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#18181b' }}>
                    {c.name}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#52525b' }}>
                    {c.legalName || '—'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#52525b', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {c.taxId || '—'}
                  </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                    <span
                        style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '4px',
                        fontSize: '0.725rem',
                        fontWeight: 600,
                        backgroundColor: c.status === 'ACTIVE' ? '#18181b' : '#f4f4f5',
                        color: c.status === 'ACTIVE' ? '#ffffff' : '#71717a'
                        }}
                    >
                        {c.status}
                    </span>
                    </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}