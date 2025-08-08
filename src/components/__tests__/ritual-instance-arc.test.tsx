import { render, fireEvent } from '@testing-library/react'
import { useRef } from 'react'
import { WheelProvider } from '../../context/wheel-provider'
import WheelMain from '../wheel-main'
import RitualInstanceArc from '../ritual-instance-arc'

function WithParent({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null)
  return (
    <div
      ref={(el) => {
        if (el) {
          Object.defineProperty(el, 'getBoundingClientRect', {
            configurable: true,
            value: () => ({ width: 200, height: 200, top: 0, left: 0, right: 200, bottom: 200, x: 0, y: 0, toJSON() {} }),
          })
          ;(ref as any).current = el
        }
      }}
    >
      <WheelProvider>
        <WheelMain parentRef={ref} numberOfSectors={4}>
          {children}
        </WheelMain>
      </WheelProvider>
    </div>
  )
}

describe('RitualInstanceArc', () => {
  it('fires onClick with keyboard and mouse', () => {
    const onClick = vi.fn()
    const { container } = render(
      <WithParent>
        <RitualInstanceArc startAngle={0} endAngle={30} title="T" onClick={onClick as any} />
      </WithParent>
    )
    const path = container.querySelector('path[role="button"]')!
    fireEvent.click(path)
    expect(onClick).toHaveBeenCalled()

    fireEvent.keyDown(path, { key: 'Enter' })
    expect(onClick).toHaveBeenCalledTimes(2)
  })
})


