import { useEffect, useState, type RefObject } from "react";
import { debounce } from "../functions/utility-functions";


// Updated by Claude 4 to use the ResizeObserver instead of window.resize on 08/07/2025 
/**
 * A React hook that calculates and returns the limiting dimension (smaller of width or height)
 * of a parent element, with support for debounced resize events and size constraints.
 * 
 * The hook uses ResizeObserver to monitor the specific element's dimensions and returns the 
 * smaller of width or height, constrained by optional minimum and maximum size limits. 
 * This is more accurate than window resize events as it detects element-specific size changes
 * from CSS updates, content changes, or layout adjustments.
 * 
 * @param parentRef - A React ref object pointing to the parent HTML div element to measure
 * @param options - Optional configuration object
 * @param options.debounceDelay - Delay in milliseconds for debouncing resize events (default: 250ms)
 * @param options.minSize - Minimum size constraint in pixels (default: 0)
 * @param options.maxSize - Maximum size constraint in pixels (default: 9999)
 * 
 * @returns The limiting dimension (smaller of width or height) constrained by min/max bounds, or null if parent ref is not available
 * 
 * @example
 * ```tsx
 * const parentRef = useRef<HTMLDivElement>(null);
 * const limitingDimension = useResize(parentRef, {
 *   debounceDelay: 300,
 *   minSize: 100,
 *   maxSize: 800
 * });
 * 
 * return (
 *   <div ref={parentRef}>
 *     <div style={{ width: limitingDimension, height: limitingDimension }}>
 *       Responsive content
 *     </div>
 *   </div>
 * );
 * ```
 */
export default function useResize(
    parentRef: RefObject<HTMLDivElement | null>, 
    options?: {
        debounceDelay?: number, 
        minSize?: number,
        maxSize?: number
    }
) {
    // set default values for options
    const debounceDelay = options?.debounceDelay ? options.debounceDelay : 250
    const minSize = options?.minSize ? options.minSize : 0
    const maxSize = options?.maxSize ? options.maxSize : 9999

    const [limitingDimension, setLimitingDimension] = useState<number | null>(null)

    useEffect(() => {
        // calculate parent dimensions and set limiting dimension as smaller of height or width
        // also accounts for potential user values for min and max dimensions
        const handleResize = () => {
            if (parentRef?.current) {
                const clientRect = parentRef.current.getBoundingClientRect()
                setLimitingDimension(
                    Math.max( 
                        Math.min(
                            clientRect.width, 
                            clientRect.height, 
                            maxSize
                        ), 
                        minSize
                    )
                )
            }
        }

        // initial dimensions on mount
        handleResize()

        // Use ResizeObserver to watch for changes to the specific element
        // This is more accurate than window.resize as it detects element-specific size changes
        const debouncedHandleResize = debounce(handleResize, debounceDelay)
        
        let resizeObserver: ResizeObserver | null = null
        
        if (parentRef?.current) {
            resizeObserver = new ResizeObserver(debouncedHandleResize)
            resizeObserver.observe(parentRef.current)
        }
        
        return () => {
            if (resizeObserver) {
                resizeObserver.disconnect()
            }
        }
    }, [parentRef, debounceDelay, minSize, maxSize])

    return limitingDimension
}