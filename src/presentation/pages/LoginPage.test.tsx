import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { LoginPage } from './LoginPage'
import { ApiClient } from '../../infrastructure/api/apiClient'
import { apiConfig } from '../../shared/api/config'

vi.mock('../../infrastructure/api/apiClient', () => ({
  ApiClient: {
    post: vi.fn(),
  },
}))

describe('LoginPage', () => {
  const mockOnLoginSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    apiConfig.useMock = true
  })

  afterEach(() => {
    cleanup()
  })

  it('renders correctly with title, description, and inputs', () => {
    render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />)

    expect(screen.getByText('Ventiq Console')).toBeInTheDocument()
    expect(screen.getByText('Enter your credentials to access the console')).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows error message if fields are empty on submit', async () => {
    render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />)

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(screen.getByText('Please enter your email and password.')).toBeInTheDocument()
    expect(mockOnLoginSuccess).not.toHaveBeenCalled()
  })

  it('handles successful login in mock mode', async () => {
    apiConfig.useMock = true
    render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />)

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'admin@ventiq.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } })

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(localStorage.getItem('user')).toBe(JSON.stringify({ email: 'admin@ventiq.com' }))
      expect(localStorage.getItem('ventiq_auth_token')).toBe('simulated-jwt-token')
      expect(mockOnLoginSuccess).toHaveBeenCalledTimes(1)
    })
  })

  it('handles successful login via API when useMock is false', async () => {
    apiConfig.useMock = false
    vi.mocked(ApiClient.post).mockResolvedValueOnce({ accessToken: 'real-api-token' })

    render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />)

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'real@ventiq.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'securepassword' } })

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(ApiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'real@ventiq.com',
        password: 'securepassword',
      })
      expect(localStorage.getItem('user')).toBe(JSON.stringify({ email: 'real@ventiq.com' }))
      expect(localStorage.getItem('ventiq_auth_token')).toBe('real-api-token')
      expect(mockOnLoginSuccess).toHaveBeenCalledTimes(1)
    })
  })

  it('displays error message on API failure when useMock is false', async () => {
    apiConfig.useMock = false
    vi.mocked(ApiClient.post).mockRejectedValueOnce(new Error('Invalid credentials'))

    render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />)

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'wrong@ventiq.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } })

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
      expect(mockOnLoginSuccess).not.toHaveBeenCalled()
    })
  })
})