import { render, screen } from '@testing-library/react'
import WheelOutline from '../wheel-outline'

describe('WheelOutline', () => {
  const common = {
    center: 100,
    outerCircleRadius: 90,
    innerCircleRadius: 30,
    numberOfSectors: 4,
    bgColor: 'transparent',
    innerCircleBg: 'black',
    stroke: 'white',
    strokeWidth: 2,
    markerStyle: 'outside' as const,
    markers: ['A', 'B', 'C', 'D'],
    startingPoint: 'left' as const,
  }

  it('renders sector paths when outlineRenderingMethod="sector"', () => {
    render(
      <svg>
        <WheelOutline {...common} outlineRenderingMethod="sector" />
      </svg>
    )

    // There should be 4 sector paths inside sector-wrapper
    const wrapper = document.getElementById('sector-wrapper')
    const sectors = wrapper?.querySelectorAll('path')
    expect(sectors && sectors.length).toBe(4)
  })

  it('renders circles and divider lines when outlineRenderingMethod="line"', () => {
    render(
      <svg>
        <WheelOutline {...common} outlineRenderingMethod="line" />
      </svg>
    )

    const group = document.getElementById('sector-wrapper')
    expect(group).toBeTruthy()
    const circles = group!.querySelectorAll('circle')
    // outer + inner circle
    expect(circles.length).toBe(2)
    // numberOfSectors + 1 divider lines
    const lines = group!.querySelectorAll('path')
    expect(lines.length).toBe(common.numberOfSectors + 1)
  })

  it('renders outside markers for provided labels', () => {
    render(
      <svg>
        <WheelOutline {...common} outlineRenderingMethod="sector" />
      </svg>
    )

    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
    expect(screen.getByText('D')).toBeInTheDocument()
  })
})


