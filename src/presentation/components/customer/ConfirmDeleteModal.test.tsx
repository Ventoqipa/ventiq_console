import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ConfirmDeleteModal } from './ConfirmDeleteModal'

describe('ConfirmDeleteModal', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <ConfirmDeleteModal
        isOpen={false}
        title="Delete Customer"
        description="Are you sure?"
        loading={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders title, description and triggers onConfirm on button click', () => {
    const handleConfirm = vi.fn()
    render(
      <ConfirmDeleteModal
        isOpen={true}
        title="Delete Customer"
        description="This will permanently delete the customer."
        loading={false}
        onClose={vi.fn()}
        onConfirm={handleConfirm}
      />
    )

    expect(screen.getByRole('heading', { name: 'Delete Customer' })).toBeInTheDocument()
    expect(screen.getByText('This will permanently delete the customer.')).toBeInTheDocument()

    const deleteBtn = screen.getByRole('button', { name: 'Delete' })
    fireEvent.click(deleteBtn)

    expect(handleConfirm).toHaveBeenCalledTimes(1)
  })
})