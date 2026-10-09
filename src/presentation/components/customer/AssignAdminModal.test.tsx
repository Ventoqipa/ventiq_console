import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { AssignAdminModal } from './AssignAdminModal'

describe('AssignAdminModal', () => {
  const defaultProps = {
    isOpen: true,
    customerName: 'Acme Corp',
    loading: false,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock para navigator.clipboard.writeText en JSDom / Vitest
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    })
  })

  afterEach(() => {
    cleanup()
  })

  it('should not render anything when isOpen is false', () => {
    const { container } = render(<AssignAdminModal {...defaultProps} isOpen={false} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render modal content and fields when isOpen is true', () => {
    render(<AssignAdminModal {...defaultProps} />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /assign client admin/i })).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('should show error when full name is missing', () => {
    render(<AssignAdminModal {...defaultProps} />)

    fireEvent.click(screen.getByRole('button', { name: /assign admin/i }))

    expect(screen.getByText('Full name is required')).toBeInTheDocument()
    expect(defaultProps.onConfirm).not.toHaveBeenCalled()
  })

  it('should show error when email is invalid', () => {
    render(<AssignAdminModal {...defaultProps} />)

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'invalid-email' } })

    fireEvent.click(screen.getByRole('button', { name: /assign admin/i }))

    expect(screen.getByText('A valid email address is required')).toBeInTheDocument()
    expect(defaultProps.onConfirm).not.toHaveBeenCalled()
  })

  it('should show error when password is less than 12 characters', () => {
    render(<AssignAdminModal {...defaultProps} />)

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@acme.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'short123' } })

    fireEvent.click(screen.getByRole('button', { name: /assign admin/i }))

    expect(screen.getByText('Password must be at least 12 characters')).toBeInTheDocument()
    expect(defaultProps.onConfirm).not.toHaveBeenCalled()
  })

  it('should call onConfirm with valid data upon submission', () => {
    render(<AssignAdminModal {...defaultProps} />)

    const validData = {
      fullName: 'John Doe',
      email: 'john@acme.com',
      password: 'SecurePassword123!',
    }

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: validData.fullName } })
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: validData.email } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: validData.password } })

    fireEvent.click(screen.getByRole('button', { name: /assign admin/i }))

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
    expect(defaultProps.onConfirm).toHaveBeenCalledWith(validData)
  })

  it('should generate an automatic password when Generate button is clicked', () => {
    render(<AssignAdminModal {...defaultProps} />)

    const generateBtn = screen.getByRole('button', { name: /generate password/i })
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement

    expect(passwordInput.value).toBe('')

    fireEvent.click(generateBtn)

    expect(passwordInput.value.length).toBeGreaterThanOrEqual(12)
  })

  it('should copy generated password to clipboard when Copy button is clicked', async () => {
    render(<AssignAdminModal {...defaultProps} />)

    const generateBtn = screen.getByRole('button', { name: /generate password/i })
    fireEvent.click(generateBtn)

    const copyBtn = screen.getByRole('button', { name: /copy/i })
    fireEvent.click(copyBtn)

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      (screen.getByLabelText(/password/i) as HTMLInputElement).value
    )
  })

  it('should call onClose when Cancel is clicked', () => {
    render(<AssignAdminModal {...defaultProps} />)

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when Escape key is pressed', () => {
    render(<AssignAdminModal {...defaultProps} />)

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('should disable form actions and display loader text when loading', () => {
    render(<AssignAdminModal {...defaultProps} loading={true} />)

    const submitBtn = screen.getByRole('button', { name: /assigning\.\.\./i })
    const cancelBtn = screen.getByRole('button', { name: /cancel/i })

    expect(submitBtn).toBeDisabled()
    expect(cancelBtn).toBeDisabled()
  })
})