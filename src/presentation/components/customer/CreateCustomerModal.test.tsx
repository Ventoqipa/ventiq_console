import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { CreateCustomerModal } from './CreateCustomerModal'

describe('CreateCustomerModal', () => {
  afterEach(() => {
    cleanup()
  })

  it('does not render when isOpen is false', () => {
    render(<CreateCustomerModal isOpen={false} onClose={vi.fn()} onSubmit={vi.fn()} />)
    expect(screen.queryByText('Create New Customer')).toBeNull()
  })

  it('shows error validation when name is empty', async () => {
    render(<CreateCustomerModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />)

    const submitBtn = screen.getByRole('button', { name: 'Create Customer' })
    fireEvent.click(submitBtn)

    expect(await screen.findByText('⚠️ Customer name is required.')).toBeInTheDocument()
  })

  it('calls onSubmit with correct data when form is valid', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined)
    const handleClose = vi.fn()

    render(<CreateCustomerModal isOpen={true} onClose={handleClose} onSubmit={handleSubmit} />)

    const nameInput = screen.getByPlaceholderText('e.g. Acme Corp')

    fireEvent.change(nameInput, {
      target: { value: 'Acme Corp' },
    })

    const submitBtn = screen.getByRole('button', { name: 'Create Customer' })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({ name: 'Acme Corp', status: 'ACTIVE' })
      expect(handleClose).toHaveBeenCalled()
    })
  })
})