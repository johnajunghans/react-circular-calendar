import { useEffect, type ReactNode, type RefObject } from "react";
import WheelOutline from "./wheel-outline";
import useResize from "../hooks/use-resize";
import { useWheelContext } from "../context/wheel-provider";

/**
 * WheelMain – top-level SVG canvas and outline renderer for the circular calendar.
 *
 * Handles responsive sizing using the parent container ref and provides
 * a consistent outline (either solid sectors or lines) around the wheel.
 */
export interface WheelMainProps {
    // Required functionality props
    children: ReactNode;
    parentRef: RefObject<HTMLDivElement | null>; // ref of parent div which svg which resize to fit
    numberOfSectors: number; // the number of sectors that should render in the wheel

    // Optional Functionality Props
    startingPoint?: "left" | "top" | "right" | "bottom" | number; // where sectors should be initially drawn from, default is left
    markerStyle?: "outside" | "inline" | "none";
    markers?: string[]; // need to be unique, enter empty string to skip
    outlineRenderingMethod?: "sector" | "line"; // determines how the outline will be rendered. A value of 'sector' creates fully bound sectors allowing the hole in the middle to show the background. A value of 'line' uses lines and circles to create sectors but the hole in the middle needs to have the background manually set. Default "sector".

    // Styling props
    svgClassName?: string; // class applied to the root <svg>
    bgColor?: string; // default black
    innerCircleBg?: string; // fill color for inner circle when rendering method is set to 'line'
    stroke?: string // default white, ideally should not be an opacity < 1 value (overlapping svg line segments creates inconsistent shades with opacity < 1)
    strokeWidth?: number // default 1

    // Outline/marker className slots (take precedence over color props above)
    outlineSectorClassName?: string;
    outlineDividerLineClassName?: string;
    outerCircleClassName?: string;
    innerCircleClassName?: string;
    markerTickClassName?: string;
    markerTextClassName?: string;

    // Dimension props
    minDimensions?: number; // minimum size of svg
    maxDimensions?: number; // maximum size of svg

    // Other props
    resizeDebounceDelay?: number; // number of miliseconds to wait before resizing wheel
}

export default function WheelMain({
    children, 
    parentRef,
    numberOfSectors,
    startingPoint="left",
    markerStyle="outside",
    markers=[],
    minDimensions=0,
    maxDimensions=9999,
    resizeDebounceDelay=100,
    svgClassName,
    bgColor="black",
    stroke="white",
    strokeWidth=1,
    outlineRenderingMethod="sector",
    innerCircleBg="black",
    outlineSectorClassName,
    outlineDividerLineClassName,
    outerCircleClassName,
    innerCircleClassName,
    markerTickClassName,
    markerTextClassName,
}: WheelMainProps) {

    const { state, dispatch } = useWheelContext()

    // Avoid noisy renders in consumer apps

    // custom resize hook call
    const limitingDimension = useResize(parentRef, {
        debounceDelay: resizeDebounceDelay,
        minSize: minDimensions,
        maxSize: maxDimensions
    })

    // keep context in sync when resizing
    useEffect(() => {
        if (limitingDimension) {
            dispatch({ type: "RESIZE", payload: limitingDimension })
        }
    }, [limitingDimension])

    if (!state || !limitingDimension) return null

    const center = state.dimensions.center
    const outerCircleRadius = state.dimensions.outerCircleRadius
    const innerCircleRadius = state.dimensions.innerCircleRadius

    return (
        <svg width={limitingDimension} height={limitingDimension} overflow="visible" className={svgClassName}>
            <WheelOutline 
                center={center} 
                outerCircleRadius={outerCircleRadius}
                innerCircleRadius={innerCircleRadius}
                numberOfSectors={numberOfSectors}
                bgColor={bgColor}
                stroke={stroke}
                strokeWidth={strokeWidth}
                markerStyle={markerStyle}
                markers={markers}
                startingPoint={startingPoint}
                outlineRenderingMethod={outlineRenderingMethod}
                innerCircleBg={innerCircleBg}
                sectorClassName={outlineSectorClassName}
                dividerLineClassName={outlineDividerLineClassName}
                outerCircleClassName={outerCircleClassName}
                innerCircleClassName={innerCircleClassName}
                markerTickClassName={markerTickClassName}
                markerTextClassName={markerTextClassName}
            />
            { children }
        </svg>
    )
}