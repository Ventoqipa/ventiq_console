import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { LoginPage } from './LoginPage'

describe('LoginPage', () => {
  afterEach(() => {
    cleanup()
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders correctly with title and inputs', () => {
    render(<LoginPage onLoginSuccess={vi.fn()} />)

    expect(screen.getByText('Ventiq Console')).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows error message if fields are empty on submit', () => {
    render(<LoginPage onLoginSuccess={vi.fn()} />)

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)

    expect(
      screen.getByText('Please enter your email and password.')
    ).toBeInTheDocument()
  })

  it('stores user session in localStorage and calls onLoginSuccess on valid submit', () => {
    const handleLoginSuccess = vi.fn()
    render(<LoginPage onLoginSuccess={handleLoginSuccess} />)

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(emailInput, { target: { value: 'admin@ventiq.com' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })
    fireEvent.click(submitButton)

    expect(localStorage.getItem('user')).toBe(
      JSON.stringify({ email: 'admin@ventiq.com' })
    )
    expect(localStorage.getItem('token')).toBe('simulated-jwt-token')
    expect(handleLoginSuccess).toHaveBeenCalledTimes(1)
  })
})