import { arc } from "d3-shape"
import { polarToRect } from "./polar-coordinate-functions"

export type SectorData = {
    step: number,
    angle: number,
    startInnerPoint: { x: number, y: number },
    startOuterPoint: { x: number, y: number },
    endInnerPoint: { x: number, y: number },
    endOuterPoint: { x: number, y: number }
}

export type LineData = {
    angle: number,
    startInnerPoint: { x: number, y: number },
    startOuterPoint: { x: number, y: number }
}

/**
 * Generates detailed data for each sector (slice) of a circular wheel outline.
 *
 * This function calculates the geometric properties for each sector of a wheel, including the start and end angles,
 * and the Cartesian coordinates of the inner and outer points that define the sector's boundaries.
 * The result is an array of objects, each representing a sector with its step number, start angle, and the coordinates
 * of its four boundary points (inner/outer, start/end).
 *
 * @param numberOfSectors - The total number of sectors (slices) to divide the wheel into.
 * @param center - The x and y coordinate of the center of the wheel (assumes a square SVG, so both are the same).
 * @param innerCircleRadius - The radius of the inner circle (where each sector starts).
 * @param outerCircleRadius - The radius of the outer circle (where each sector ends).
 * @param startingAngle - The angle (in degrees) at which the first sector starts (e.g., 0 for left, 90 for top).
 * @returns An array of SectorData objects, each containing the step number, start angle, and the coordinates of the sector's boundary points.
 *
 */
export function generateOutlineSectorData(
    numberOfSectors: number, 
    center: number, 
    innerCircleRadius: number, 
    outerCircleRadius: number, 
    startingAngle: number
) {
    const sectorData: SectorData[] = []
    let step = 1 // mutatable variable to hold current step

    // starting points
    
    const startInnerPoint = polarToRect(center, center, innerCircleRadius, startingAngle)
    const startOuterPoint = polarToRect(center, center, outerCircleRadius, startingAngle)

    // recursive function to generate sector data
    function generateSector(
        sharedInnerPoint: { x: number, y: number }, 
        sharedOuterPoint: { x: number, y: number },
        prevAngle: number
    ) {
        if (step > numberOfSectors) return // conditional to stop function when number of steps has been reached

        const angle = prevAngle + 360 / numberOfSectors
        const endInnerPoint = polarToRect(center, center, innerCircleRadius, angle)
        const endOuterPoint = polarToRect(center, center, outerCircleRadius, angle)

        sectorData.push({
            step,
            angle: prevAngle,
            startInnerPoint: sharedInnerPoint,
            startOuterPoint: sharedOuterPoint,
            endInnerPoint,
            endOuterPoint
        })

        step++ // increment step
        generateSector(endInnerPoint, endOuterPoint, angle)
    }

    generateSector(startInnerPoint, startOuterPoint, startingAngle)
    return sectorData
}

/**
 * Generates line data for the outlines (dividers) of a circular wheel with a given number of sectors.
 *
 * This function calculates the angle and the start/end points (in Cartesian coordinates) for each dividing line
 * between sectors of a circular wheel, based on the provided center, inner and outer radii.
 * The result is an array of objects, each representing a line from the inner circle to the outer circle at a specific angle.
 *
 * @param numberOfSectors - The number of sectors (divisions) in the wheel.
 * @param center - The x and y coordinate of the center of the wheel (assumes a square SVG, so both are the same).
 * @param innerCircleRadius - The radius of the inner circle (where each line starts).
 * @param outerCircleRadius - The radius of the outer circle (where each line ends).
 * @returns An array of LineData objects, each containing the angle (in degrees), and the inner/outer points for each sector divider.
 *
 */
export function generateOutlineLineData(
    numberOfSectors: number, 
    center: number, 
    innerCircleRadius: number, 
    outerCircleRadius: number
) {
    const lineData: LineData[] = []
    
    for(let i = 0; i <= numberOfSectors; i++) {
        const angle = 360 / numberOfSectors * i
        const startInnerPoint = polarToRect(center, center, innerCircleRadius, angle)
        const startOuterPoint = polarToRect(center, center, outerCircleRadius, angle)
        const line: LineData = {
            angle,
            startInnerPoint,
            startOuterPoint
        }
        lineData.push(line) 
    }

    return lineData
}

/**
 * Generates an SVG path string for a single arc segment using D3's arc generator.
 *
 * This function is useful for rendering arc shapes (such as pie chart sectors or circular progress bars)
 * in SVG, with support for rounded corners, padding between arcs, and proper handling of arcs that cross
 * the 0-degree (midnight) boundary.
 *
 * @param startAngle - The starting angle of the arc, in degrees.
 * @param endAngle - The ending angle of the arc, in degrees.
 * @param outerRadius - The outer radius of the arc.
 * @param innerRadius - The inner radius of the arc.
 * @param cornerRadius - (Optional) The radius for rounded corners on the arc. Default is 0.
 * @param padAngle - (Optional) The angular padding between adjacent arcs, in radians. Default is 0.
 * @param radialPadding - (Optional) The amount to pad the arc's inner and outer radii, in pixels. Default is 0.
 * @returns An SVG path string representing the arc segment.
 */
export function generateSingleArc(
    startAngle: number, // in degrees
    endAngle: number, // in degrees
    outerRadius: number, 
    innerRadius: number, 
    cornerRadius: number = 0, 
    padAngle: number = 0, // small number, e.g. 0.005
    radialPadding: number = 0 // padding around outer and inner radii of arc
) {
    // Handle the case where the time span crosses midnight
    // If end angle is less than start angle, add 360 degrees to end angle
    const adjustedEa = endAngle < startAngle ? endAngle + 360 : endAngle
    
    // Adjust both angles by -90 degrees to align with D3's coordinate system
    // (D3 starts at 12 o'clock and goes clockwise, we need to adjust)
    const startAngleRadians = (startAngle - 90) * Math.PI / 180
    const endAngleRadians = (adjustedEa - 90) * Math.PI / 180

    // Create d3 arc generator
    const arcGenerator = arc()
        .cornerRadius(cornerRadius)
        .padAngle(padAngle)

    // Generate the path data
    const pathData: string = arcGenerator({ 
        startAngle: startAngleRadians, 
        endAngle: endAngleRadians, 
        innerRadius: innerRadius + radialPadding, 
        outerRadius: outerRadius - radialPadding 
    }) || ''

    return pathData
}

/**
 * Generates an array of SVG path strings representing a sequence of arc segments (sectors) that together form a complete ring or wheel.
 *
 * This function is useful for rendering pie chart sectors, circular menus, or any wheel-like UI where the circle is divided into equal segments.
 * Each arc segment is generated using D3's arc generator, with support for rounded corners, angular padding, and radial padding.
 *
 * @param numberOfSectors - The total number of sectors (arc segments) to generate.
 * @param startAngle - The starting angle for the first sector, in degrees.
 * @param outerRadius - The outer radius of the arc segments.
 * @param innerRadius - The inner radius of the arc segments.
 * @param cornerRadius - (Optional) The radius for rounded corners on the arc. Default is 0.
 * @param padAngle - (Optional) The angular padding between adjacent arcs, in radians. Default is 0.
 * @param radialPadding - (Optional) The amount to pad the arc's inner and outer radii, in pixels. Default is 0.
 * @returns An array of SVG path strings, each representing one arc segment.
 */
export function generateArcSequence(
    numberOfSectors: number,
    startAngle: number, // in degrees
    outerRadius: number, // in degrees
    innerRadius: number,
    cornerRadius: number = 0, 
    padAngle: number = 0, // small number, e.g. 0.005
    radialPadding: number = 0 // padding around outer and inner radii of arc
) {
    const paths: string[] = []
    let step = 1

    const arcGenerator = arc()
        .cornerRadius(cornerRadius)
        .padAngle(padAngle)

    function generateArc(startAngle: number) {
        if (step > numberOfSectors) return

        const endAngle = startAngle + 360 / numberOfSectors
        const adjustedEndAngle = startAngle > endAngle ? endAngle + 360 : endAngle

        const startAngleRadians = (startAngle - 90) * Math.PI / 180
        const endAngleRadians = (adjustedEndAngle - 90) * Math.PI / 180

        const path = arcGenerator({
            startAngle: startAngleRadians,
            endAngle: endAngleRadians,
            innerRadius: innerRadius + radialPadding,
            outerRadius: outerRadius - radialPadding
        }) || ''

        paths.push(path)
        step++

        generateArc(endAngle)
    }

    generateArc(startAngle)

    return paths
}

/**
 * Calculates the data needed for positioning and orienting text within a sector of a circular wheel.
 *
 * @param center - The center coordinate (x and y) of the wheel.
 * @param outerCircleRadius - The radius of the outer circle where the text will be placed.
 * @param startAngle - The starting angle of the sector, in degrees.
 * @param endAngle - The ending angle of the sector, in degrees.
 * @returns An object containing:
 *   - ta: The angle at which the text should be placed (in degrees).
 *   - ft: A boolean indicating whether the text should be flipped (true if between 90 and 270 degrees).
 *   - tc: The coordinates (x, y) for the center of the text, calculated using polar coordinates.
 *   - to: The offset distance from the arc for the text, as a fraction of the outer radius.
 */
export function calculateSectorTextData(
    center: number, 
    outerCircleRadius: number, 
    startAngle: number, // in degrees
    endAngle: number // in degrees
) {
    // Calculate text angle 
    const ta = endAngle >= startAngle ? (startAngle + endAngle) / 2 : (startAngle + endAngle + 360) / 2
    // Flip text boolean check
    const ft = ta >= 90 && ta < 270 ? true : false
    // Calculate text center
    const tc = polarToRect(center, center, outerCircleRadius, ta)
    // Calculate text offset
    const to = outerCircleRadius * 0.04

    return { ta, ft, tc, to }
}
