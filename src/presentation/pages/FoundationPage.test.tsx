import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FoundationPage } from './FoundationPage'

describe('FoundationPage', () => {
  it('renders the Ventiq Console foundation', () => {
    render(<FoundationPage />)
    expect(
      screen.getByRole('heading', { name: 'Ventiq Console' }),
    ).toBeInTheDocument()
  })
})
