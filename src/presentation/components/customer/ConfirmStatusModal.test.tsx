import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ConfirmStatusModal } from './ConfirmStatusModal'

describe('ConfirmStatusModal', () => {
  it('should render nothing when isOpen is false', () => {
    const { container } = render(
      <ConfirmStatusModal
        isOpen={false}
        customerName="Acme Corp"
        targetStatus="SUSPENDED"
        loading={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('should render suspend title and confirmation message', () => {
    render(
      <ConfirmStatusModal
        isOpen={true}
        customerName="Acme Corp"
        targetStatus="SUSPENDED"
        loading={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    )

    expect(screen.getByText('Suspend Customer Access')).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Yes, Suspend' })).toBeInTheDocument()
  })

  it('should call onConfirm when action button is clicked', () => {
    const onConfirmMock = vi.fn()
    render(
      <ConfirmStatusModal
        isOpen={true}
        customerName="Acme Corp"
        targetStatus="ACTIVE"
        loading={false}
        onClose={vi.fn()}
        onConfirm={onConfirmMock}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Yes, Activate' }))
    expect(onConfirmMock).toHaveBeenCalledTimes(1)
  })
})