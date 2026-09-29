import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FoundationPage } from './FoundationPage'

describe('FoundationPage',()=>{it('renders the selected product area',()=>{render(<FoundationPage area="Ventiq Admin"/>);expect(screen.getByRole('heading',{name:'Ventiq Admin'})).toBeInTheDocument()})})
