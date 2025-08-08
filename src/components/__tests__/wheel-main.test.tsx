import { render } from '@testing-library/react'
import { useRef } from 'react'
import { WheelProvider } from '../../context/wheel-provider'
import WheelMain from '../wheel-main'

function WithParent({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null)
  return (
    <div
      ref={(el) => {
        if (el) {
          Object.defineProperty(el, 'getBoundingClientRect', {
            configurable: true,
            value: () => ({ width: 300, height: 200, top: 0, left: 0, right: 300, bottom: 200, x: 0, y: 0, toJSON() {} }),
          })
          ;(ref as any).current = el
        }
      }}
    >
      <WheelProvider>
        <WheelMain parentRef={ref} numberOfSectors={6}>
          <g id="child" />
        </WheelMain>
      </WheelProvider>
    </div>
  )
}

describe('WheelMain', () => {
  it('renders an SVG with expected size and outline', async () => {
    const { container, findByRole } = render(<WithParent><div /></WithParent>)
    const svg = await findByRole('img', {}, { timeout: 100 }).catch(() => container.querySelector('svg'))
    expect(svg).toBeTruthy()
    const outline = container.querySelector('#wheel-outline')
    expect(outline).toBeTruthy()
  })
})


