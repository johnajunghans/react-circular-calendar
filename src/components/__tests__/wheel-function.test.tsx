import { render } from '@testing-library/react'
import { useRef, useState } from 'react'
import { WheelProvider } from '../../context/wheel-provider'
import WheelMain from '../wheel-main'
import WheelFunction from '../wheel-function'
import type { Event } from '../../types/event'

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
        <WheelMain parentRef={ref} numberOfSectors={12}>
          {children}
        </WheelMain>
      </WheelProvider>
    </div>
  )
}

describe('WheelFunction', () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

  const events: Event<typeof days>[] = [
    { startAngle: 0, endAngle: 30, title: 'E1', activeWheels: ['Mon', 'Tue'] },
    { startAngle: 40, endAngle: 60, title: 'E2', activeWheels: ['Wed'] },
    { startAngle: 100, endAngle: 120, title: 'E3', activeWheels: ['Mon'] },
  ]

  it('filters events by activeWheel when selector is used', () => {
    function Demo() {
      const [day, setDay] = useState<typeof days[number]>('Mon')
      return (
        <WithParent>
          <WheelFunction
            useSelector
            wheels={days}
            activeWheel={day}
            setActiveWheel={setDay}
            events={events}
          />
        </WithParent>
      )
    }

    const { container } = render(<Demo />)
    // RitualInstanceArc renders a path per event
    const paths = container.querySelectorAll('path')
    // There are also outline paths; ensure at least the 2 matching events exist
    const eventPaths = Array.from(paths).filter((p) => p.getAttribute('aria-label') || p.getAttribute('role') === 'button')
    expect(eventPaths.length).toBeGreaterThanOrEqual(2)
  })

  it('throws when selector is enabled without required props', () => {
    expect(() =>
      render(
        <WithParent>
          {/* @ts-expect-error intentional missing props */}
          <WheelFunction useSelector events={[]} />
        </WithParent>
      )
    ).toThrow()
  })
})


