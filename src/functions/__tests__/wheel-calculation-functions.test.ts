import { generateOutlineSectorData, generateOutlineLineData, generateSingleArc, generateArcSequence, calculateSectorTextData } from '../wheel-calculation-functions'

describe('wheel-calculation-functions', () => {
  it('generateOutlineSectorData returns correct number of sectors and angles', () => {
    const data = generateOutlineSectorData(4, 100, 30, 90, 0)
    expect(data).toHaveLength(4)
    expect(data[0].angle).toBe(0)
    expect(data[1].angle).toBe(90)
  })

  it('generateOutlineLineData returns numberOfSectors + 1 lines', () => {
    const data = generateOutlineLineData(6, 100, 30, 90)
    expect(data).toHaveLength(7)
  })

  it('generateSingleArc returns path and handles midnight crossing', () => {
    const p1 = generateSingleArc(0, 30, 90, 30)
    expect(p1).toMatch(/[A-Za-z]/)
    const p2 = generateSingleArc(350, 10, 90, 30) // crosses midnight
    expect(p2).toMatch(/[A-Za-z]/)
  })

  it('generateArcSequence returns correct count', () => {
    const paths = generateArcSequence(8, 0, 90, 30)
    expect(paths).toHaveLength(8)
  })

  it('calculateSectorTextData computes ta, ft, tc, to', () => {
    const { ta, ft, tc, to } = calculateSectorTextData(100, 90, 0, 30)
    expect(ta).toBe(15)
    expect(typeof ft).toBe('boolean')
    expect(tc).toHaveProperty('x')
    expect(to).toBeGreaterThan(0)
  })
})


