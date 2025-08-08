import { render, screen } from '@testing-library/react'
import { useEffect } from 'react'
import { WheelProvider, useWheelContext } from '../wheel-provider'

function Probe() {
  const { state, dispatch } = useWheelContext()
  useEffect(() => {
    dispatch({ type: 'RESIZE', payload: 200 })
  }, [dispatch])
  return <div data-testid="center">{state?.dimensions.center}</div>
}

describe('WheelProvider', () => {
  it('computes dimensions on RESIZE with defaults', async () => {
    render(
      <WheelProvider>
        <Probe />
      </WheelProvider>
    )
    // center is half of limiting dimension
    expect(await screen.findByTestId('center')).toHaveTextContent('100')
  })

  it('throws when hook used outside provider', () => {
    const Consumer = () => {
      // This should throw when rendered
      useWheelContext()
      return null
    }
    expect(() => render(<Consumer />)).toThrow(
      'React Circular Calendar context is being called outside of its scope!'
    )
  })
})


