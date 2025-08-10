import { createContext, useContext, useMemo, type ReactNode, type RefObject } from "react";
import useResize from "../hooks/use-resize";

// ------------ LOCAL TYPES ------------ //

type WheelDimensions = {
    center: number;
    outerCircleRadius: number;
    innerCircleRadius: number;
}

type WheelData = {
    dimensions: WheelDimensions;
    limitingDimension: number;
} | null

interface WheelProviderProps {
    children: ReactNode;
    parentRef: RefObject<HTMLDivElement | null>; // ref of parent div which svg should resize to fit
    outerCircleSize?: number;
    innerCircleSize?: number;
    // Resize options
    minDimensions?: number; // minimum size of svg
    maxDimensions?: number; // maximum size of svg
    resizeDebounceDelay?: number; // number of milliseconds to wait before resizing wheel
}

const WheelContext = createContext<WheelData>(null);

/**
 * WheelProvider - React Context Provider for managing circular calendar wheel state and dimensions
 * 
 * This provider manages the state of a circular calendar wheel, including its dimensions
 * and provides automatic resize monitoring of the parent container. The wheel dimensions 
 * are calculated as percentages of the limiting container dimension.
 * 
 * @param children - React nodes to be wrapped by the provider
 * @param parentRef - Ref of parent div which svg should resize to fit
 * @param outerCircleSize - Percentage (0-100) of the limiting dimension to use for the outer circle radius. Defaults to 90
 * @param innerCircleSize - Percentage (0-100) of the limiting dimension to use for the inner circle radius. Defaults to 30
 * @param minDimensions - Minimum size of svg. Defaults to 0
 * @param maxDimensions - Maximum size of svg. Defaults to 9999
 * @param resizeDebounceDelay - Number of milliseconds to wait before resizing wheel. Defaults to 100
 * 
 * @example
 * ```tsx
 * const parentRef = useRef<HTMLDivElement>(null);
 * 
 * <div ref={parentRef}>
 *   <WheelProvider parentRef={parentRef} outerCircleSize={85} innerCircleSize={25}>
 *     <CircularCalendar />
 *   </WheelProvider>
 * </div>
 * ```
 */
export const WheelProvider = ({ 
    children, 
    parentRef,
    outerCircleSize=90, 
    innerCircleSize=30,
    minDimensions=0,
    maxDimensions=9999,
    resizeDebounceDelay=100
}: WheelProviderProps) => {

    const limitingDimension = useResize(parentRef, {
        debounceDelay: resizeDebounceDelay,
        minSize: minDimensions,
        maxSize: maxDimensions
    })

    const state = useMemo<WheelData>(() => {
        if (!limitingDimension) return null;
        const center = limitingDimension / 2;
        return {
            limitingDimension,
            dimensions: {
                center,
                outerCircleRadius: (center * outerCircleSize) / 100,
                innerCircleRadius: (center * innerCircleSize) / 100,
            },
        };
    }, [limitingDimension, outerCircleSize, innerCircleSize]);

    return <WheelContext.Provider value={state}>{children}</WheelContext.Provider>;
}

export const useWheelContext = () => useContext(WheelContext);