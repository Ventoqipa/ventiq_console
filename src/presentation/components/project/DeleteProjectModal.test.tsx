import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { DeleteProjectModal } from './DeleteProjectModal'

describe('DeleteProjectModal', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders modal title and project name correctly when isOpen is true', () => {
    render(
      <DeleteProjectModal
        isOpen={true}
        projectName="E-commerce Redesign"
        loading={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Delete Project')).toBeInTheDocument()
    expect(screen.getByText(/"E-commerce Redesign"/i)).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(
      <DeleteProjectModal
        isOpen={false}
        projectName="E-commerce Redesign"
        loading={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls onConfirm when clicking Delete button', () => {
    const handleConfirm = vi.fn()
    render(
      <DeleteProjectModal
        isOpen={true}
        projectName="E-commerce Redesign"
        loading={false}
        onClose={vi.fn()}
        onConfirm={handleConfirm}
      />
    )

    const confirmButton = screen.getByRole('button', { name: /^delete$/i })
    fireEvent.click(confirmButton)

    expect(handleConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when clicking Cancel button', () => {
    const handleClose = vi.fn()
    render(
      <DeleteProjectModal
        isOpen={true}
        projectName="E-commerce Redesign"
        loading={false}
        onClose={handleClose}
        onConfirm={vi.fn()}
      />
    )

    const cancelButton = screen.getByRole('button', { name: /^cancel$/i })
    fireEvent.click(cancelButton)

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('disables buttons and shows loading text during deletion process', () => {
    render(
      <DeleteProjectModal
        isOpen={true}
        projectName="E-commerce Redesign"
        loading={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    )

    const confirmButton = screen.getByRole('button', { name: /deleting\.\.\./i })
    const cancelButton = screen.getByRole('button', { name: /^cancel$/i })

    expect(confirmButton).toBeDisabled()
    expect(cancelButton).toBeDisabled()
  })
})