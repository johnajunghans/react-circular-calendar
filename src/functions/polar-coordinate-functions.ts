export type Coordinates = { x: number, y: number }

/**
 * Converts polar coordinates to rectangular coordinates
 * @param cx - The x-coordinate of the center point
 * @param cy - The y-coordinate of the center point
 * @param r - The radius (distance from center)
 * @param t - The angle in degrees (0-360)
 * @returns An object containing the rectangular coordinates {x, y}
 */
function polarToRect(cx: number, cy: number, r: number, t: number): Coordinates {
    return { x: cx - r * Math.cos(t * Math.PI / 180), y: cy - r * Math.sin(t * Math.PI / 180) }
}

/**
 * Converts a time string in "HH:MM" format to decimal hours
 * @param time - Time string in "HH:MM" format (e.g., "14:30")
 * @returns The time converted to decimal hours (e.g., 14.5 for "14:30")
 */
function timeStringToHours(time: string): number {
    return Number(time.slice(0,2)) + Number(time.slice(3,5)) / 60
}

/**
 * Converts hours to degrees on a circular clock face
 * @param hours - The time in decimal hours
 * @param springPoint - The reference point (default: 6 o'clock position)
 * @returns The angle in degrees, where 0 degrees is at the spring point
 */
function hoursToDegrees(hours: number, springPoint = 6): number {
    return 15 * hours - 15 * springPoint
}

/**
 * Converts a time string to degrees on a circular clock face
 * @param time - Time string in "HH:MM" format (e.g., "14:30")
 * @param springPoint - The reference point (default: 6 o'clock position)
 * @returns The angle in degrees, where 0 degrees is at the spring point
 */
function timeStringToDegrees(time: string, springPoint = 6): number {
    return hoursToDegrees(timeStringToHours(time), springPoint)
}

/**
 * Converts a time (string or number) to rectangular coordinates on a circular clock face
 * @param time - Time as a string ("HH:MM") or decimal hours
 * @param cx - The x-coordinate of the circle center
 * @param cy - The y-coordinate of the circle center
 * @param r - The radius of the circle
 * @param springPoint - The reference point (default: 6 o'clock position)
 * @returns An object containing the rectangular coordinates {x, y}
 */
function timeToCoordinates(time: string | number, cx: number, cy: number, r: number, springPoint = 6): Coordinates {
    if (typeof time === "string") {
        return polarToRect(cx, cy, r, timeStringToDegrees(time, springPoint))
    } else {
        return polarToRect(cx, cy, r, hoursToDegrees(time, springPoint))
    }
}

export { 
    polarToRect,
    timeStringToHours,
    hoursToDegrees,
    timeStringToDegrees,
    timeToCoordinates
}