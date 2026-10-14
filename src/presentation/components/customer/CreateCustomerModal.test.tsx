import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { CreateCustomerModal } from './CreateCustomerModal'
import { ToastProvider } from '../../context/ToastContext'

describe('CreateCustomerModal', () => {
  afterEach(() => {
    cleanup()
  })

  const renderComponent = (props: {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: { name: string; slug: string }) => Promise<void>
  }) =>
    render(
      <ToastProvider>
        <CreateCustomerModal {...props} />
      </ToastProvider>
    )

  it('does not render when isOpen is false', () => {
    renderComponent({ isOpen: false, onClose: vi.fn(), onSubmit: vi.fn() })
    expect(screen.queryByText('Create New Customer')).toBeNull()
  })

  it('shows error validation when name is empty', async () => {
    renderComponent({ isOpen: true, onClose: vi.fn(), onSubmit: vi.fn() })

    const submitBtn = screen.getByRole('button', { name: 'Create Customer' })
    fireEvent.click(submitBtn)

    expect(await screen.findByText('⚠️ Customer name is required.')).toBeInTheDocument()
  })

  it('calls onSubmit with correct data when form is valid', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined)
    const handleClose = vi.fn()

    renderComponent({ isOpen: true, onClose: handleClose, onSubmit: handleSubmit })

    const nameInput = screen.getByPlaceholderText('e.g. Acme Corp')

    fireEvent.change(nameInput, {
      target: { value: 'Acme Corp' },
    })

    const submitBtn = screen.getByRole('button', { name: 'Create Customer' })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'Acme Corp',
        slug: 'acme-corp',
      })
      expect(handleClose).toHaveBeenCalled()
    })
  })

  it('shows error toast when onSubmit fails', async () => {
    const handleSubmit = vi.fn().mockRejectedValue(new Error('Server creation failed'))

    renderComponent({ isOpen: true, onClose: vi.fn(), onSubmit: handleSubmit })

    const nameInput = screen.getByPlaceholderText('e.g. Acme Corp')
    fireEvent.change(nameInput, { target: { value: 'Acme Corp' } })

    const submitBtn = screen.getByRole('button', { name: 'Create Customer' })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Server creation failed')
    })
  })
})