import { render, screen } from '@testing-library/react'
import { useRef } from 'react'
import useResize from '../use-resize'

function Host({ width, height, minSize, maxSize }: { width: number; height: number; minSize?: number; maxSize?: number }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const dim = useResize(ref, { minSize, maxSize, debounceDelay: 0 })
  return (
    <div
      ref={(el) => {
        if (el) {
          Object.defineProperty(el, 'getBoundingClientRect', {
            configurable: true,
            value: () => ({
              width,
              height,
              top: 0,
              left: 0,
              right: width,
              bottom: height,
              x: 0,
              y: 0,
              toJSON() {},
            }),
          })
          // set to ref after customizing
          ;(ref as any).current = el
        }
      }}
      data-testid="dim"
    >
      {dim}
    </div>
  )
}

describe('useResize', () => {
  it('returns the limiting dimension (min of width/height)', async () => {
    render(<Host width={200} height={120} />)
    expect(await screen.findByTestId('dim')).toHaveTextContent('120')
  })

  it('applies maxSize and minSize constraints', async () => {
    const { rerender } = render(<Host width={5000} height={5000} maxSize={800} />)
    expect(await screen.findByTestId('dim')).toHaveTextContent('800')

    rerender(<Host width={50} height={40} minSize={100} />)
    expect(await screen.findByTestId('dim')).toHaveTextContent('100')
  })
})


