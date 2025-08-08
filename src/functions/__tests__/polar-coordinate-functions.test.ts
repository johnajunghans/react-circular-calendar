import { polarToRect, timeStringToHours, hoursToDegrees, timeStringToDegrees, timeToCoordinates } from '../polar-coordinate-functions'

describe('polar-coordinate-functions', () => {
  it('polarToRect converts correctly at cardinal points', () => {
    const cx = 100, cy = 100, r = 50
    const approx = (a: number, b: number) => expect(a).toBeCloseTo(b, 10)
    const p0 = polarToRect(cx, cy, r, 0)
    const p90 = polarToRect(cx, cy, r, 90)
    const p180 = polarToRect(cx, cy, r, 180)
    const p270 = polarToRect(cx, cy, r, 270)
    approx(p0.x, 50); approx(p0.y, 100)
    approx(p90.x, 100); approx(p90.y, 50)
    approx(p180.x, 150); approx(p180.y, 100)
    approx(p270.x, 100); approx(p270.y, 150)
  })

  it('time helpers convert as expected', () => {
    expect(timeStringToHours('14:30')).toBeCloseTo(14.5)
    expect(hoursToDegrees(6)).toBe(0)
    expect(timeStringToDegrees('06:00')).toBe(0)
    const coords = timeToCoordinates('06:00', 0, 0, 10)
    expect(coords).toEqual(polarToRect(0, 0, 10, 0))
  })
})


