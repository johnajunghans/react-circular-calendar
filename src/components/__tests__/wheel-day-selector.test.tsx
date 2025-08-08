import { render, fireEvent, screen } from '@testing-library/react'
import { useRef, useState } from 'react'
import { WheelProvider } from '../../context/wheel-provider'
import WheelMain from '../wheel-main'
import WheelDaySelector from '../wheel-day-selector'

function WithParent({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null)
  return (
    <div
      ref={(el) => {
        if (el) {
          Object.defineProperty(el, 'getBoundingClientRect', {
            configurable: true,
            value: () => ({ width: 300, height: 300, top: 0, left: 0, right: 300, bottom: 300, x: 0, y: 0, toJSON() {} }),
          })
          ;(ref as any).current = el
        }
      }}
    >
      <WheelProvider>
        <WheelMain parentRef={ref} numberOfSectors={7}>
          {children}
        </WheelMain>
      </WheelProvider>
    </div>
  )
}

describe('WheelDaySelector', () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const

  it('changes active wheel on click and keyboard', () => {
    function Demo() {
      const [active, setActive] = useState<typeof days[number]>('Sunday')
      return (
        <WithParent>
          <WheelDaySelector wheels={days} activeWheel={active} setActiveWheel={setActive} />
        </WithParent>
      )
    }

    const { container } = render(<Demo />)
    const pathButtons = container.querySelectorAll('#selector-paths-container path')
    expect(pathButtons.length).toBe(7)

    fireEvent.click(pathButtons[1]) // Monday
    // Active text should include Mon
    expect(screen.getAllByText(/Mon|Mon/)[0]).toBeInTheDocument()

    fireEvent.keyDown(pathButtons[2], { key: 'Enter' }) // Tuesday
    expect(screen.getAllByText(/Tue|Tue/)[0]).toBeInTheDocument()

    fireEvent.keyDown(pathButtons[3], { key: ' ' }) // Wednesday
    expect(screen.getAllByText(/Wed|Wed/)[0]).toBeInTheDocument()
  })

  it('validates middle button props', () => {
    // Missing middleButtonType when useMiddleButton
    expect(() =>
      render(
        <WithParent>
          {/* @ts-expect-error intentional missing type */}
          <WheelDaySelector wheels={['A', 'B', 'C'] as const} activeWheel={'A'} setActiveWheel={() => {}} useMiddleButton />
        </WithParent>
      )
    ).toThrow()
  })
})


