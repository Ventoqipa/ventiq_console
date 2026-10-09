import React, { useState } from 'react'
import { ApiClient } from '../../infrastructure/api/apiClient'
import { apiConfig } from '../../shared/api/config'

export interface LoginPageProps {
  onLoginSuccess: () => void
}

interface LoginResponse {
  accessToken: string
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      if (apiConfig.useMock) {
        // Simulated authentication for mock mode
        localStorage.setItem('user', JSON.stringify({ email }))
        localStorage.setItem('ventiq_auth_token', 'simulated-jwt-token')
      } else {
        // Real API authentication against Railway backend
        const response = await ApiClient.post<LoginResponse>('/auth/login', {
          email,
          password,
        })

        localStorage.setItem('user', JSON.stringify({ email }))
        localStorage.setItem('ventiq_auth_token', response.accessToken)
      }

      onLoginSuccess()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials or server error.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f4f5f7',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e4e4e7',
          padding: '2.5rem 2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Header with Dashboard Visual Identity */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span
            style={{
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#71717a',
              display: 'block',
              fontWeight: 600,
              marginBottom: '0.25rem',
            }}
          >
            VENTIQ PLATFORM
          </span>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#18181b',
              margin: 0,
            }}
          >
            Ventiq Console
          </h1>
          <p
            style={{
              fontSize: '0.825rem',
              color: '#71717a',
              marginTop: '0.5rem',
            }}
          >
            Enter your credentials to access the console
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#ef4444',
              padding: '0.65rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              marginBottom: '1.25rem',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#71717a',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.4rem',
              }}
            >
              EMAIL ADDRESS
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@ventiq.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #e4e4e7',
                fontSize: '0.875rem',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#fafafa',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#71717a',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.4rem',
              }}
            >
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #e4e4e7',
                fontSize: '0.875rem',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#fafafa',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: '#18181b',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.65rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'background-color 0.2s',
            }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div
          style={{
            marginTop: '2rem',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: '#a1a1aa',
          }}
        >
          v0.1.0 · MVP
        </div>
      </div>
    </div>
  )
}