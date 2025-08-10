import type { ReactNode } from "react";
import { useMemo } from "react";
import { polarToRect } from "../functions/polar-coordinate-functions";
import { generateOutlineLineData, generateOutlineSectorData, type LineData, type SectorData } from "../functions/wheel-calculation-functions";
import { useWheelContext } from "../context/wheel-provider";

interface WheelOutlineProps {
    children: ReactNode; // Should be WheelFunction

    // Required Props
    numberOfSectors: number;
    markers?: string[];

    renderMethod?: "sector" | "line";
    bgColor?: string;
    innerCircleBgColor?: string;
    stroke?: string;
    strokeWidth?: number;
    svgClassName?: string;
    outlineClassName?: string;
    markerClassName?: string;
    startingPoint: "left" | "top" | "right" | "bottom" | number;
    
}

export default function WheelOutline({ 
    children,
    numberOfSectors,
    renderMethod,
    bgColor,
    stroke,
    strokeWidth,
    markers=[],
    startingPoint,
    innerCircleBgColor,
    svgClassName,
    outlineClassName,
    markerClassName
}: WheelOutlineProps) {

    // ------------ STATE AND PATH DATA ------------ //

    const state = useWheelContext()
    
    // Move all hook calls before any conditional logic
    const startingAngle = 
        startingPoint === "left" ? 0 :
        startingPoint === "top" ? 90 : 
        startingPoint === "right" ? 180 :
        startingPoint === "bottom" ? 270 :
        startingPoint // if it is a number

    const { center, innerCircleRadius, outerCircleRadius } = state?.dimensions || { center: 0, innerCircleRadius: 0, outerCircleRadius: 0 }
    const limitingDimension = state?.limitingDimension

    // Always call useMemo, but with safe defaults when state is null
    const pathData = useMemo(() => {
        if (!state || !center || !innerCircleRadius || !outerCircleRadius) {
            return []
        }
        return renderMethod === "line"
            ? generateOutlineLineData(numberOfSectors, center, innerCircleRadius, outerCircleRadius)
            : generateOutlineSectorData(numberOfSectors, center, innerCircleRadius, outerCircleRadius, startingAngle);
    }, [state, renderMethod, numberOfSectors, center, innerCircleRadius, outerCircleRadius, startingAngle]);

    // Now do conditional rendering in JSX
    if (!state) return null

    // ------------ OUTLINE ------------ //

    const Outline = () => {
        if (renderMethod === "line") {
            return (
                <>
                    <circle cx={center} cy={center} r={outerCircleRadius} stroke={stroke} fill={bgColor} className={outlineClassName} />
                    {(pathData as LineData[]).map(line => (
                        <path 
                            key={line.angle}
                            d={`
                                M ${line.startInnerPoint.x} ${line.startInnerPoint.y}
                                L ${line.startOuterPoint.x} ${line.startOuterPoint.y}
                            `}
                            stroke={stroke}
                            strokeWidth={strokeWidth}
                            className={outlineClassName}
                        />
                    ))}
                    <circle cx={center} cy={center} r={innerCircleRadius} stroke={stroke} fill={innerCircleBgColor} className={outlineClassName} />
                </>
            )
        } else {
            return (
                (pathData as SectorData[]).map((sector) => (
                    <path 
                        key={sector.step}
                        d={`
                            M ${sector.startInnerPoint.x} ${sector.startInnerPoint.y} 
                            L ${sector.startOuterPoint.x} ${sector.startOuterPoint.y}
                            A ${outerCircleRadius} ${outerCircleRadius} 1 0 1 ${sector.endOuterPoint.x} ${sector.endOuterPoint.y}
                            L ${sector.endInnerPoint.x} ${sector.endInnerPoint.y} 
                            A ${innerCircleRadius} ${innerCircleRadius} 1 0 0 ${sector.startInnerPoint.x} ${sector.startInnerPoint.y} 
                        `}
                        fill={bgColor}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        className={outlineClassName} 
                    />
                ))
            )
        }
    }

    // ------------ MARKERS ------------ // 

    // Hardcoded prop for potential later integration
    const markerStyle: "outside" | "inline" | "none" = "outside"
    
    function Markers(): ReactNode[] {
        if (markerStyle === "none") {
            return []

        } else if (markerStyle === "outside") {
            return markers.map((marker, index) => {
                if (!marker) return // return if marker is empty string

                const sector = pathData[index]
                const adjustedAngle = sector.angle >= 360 ? sector.angle - 360 : sector.angle // ensure angle is within 360 degrees

                const outerDashPoint = polarToRect(center, center, outerCircleRadius+10, adjustedAngle)
                const textPosition = polarToRect(center, center, outerCircleRadius+15, adjustedAngle)

                const textAnchor = 
                    adjustedAngle < 90 ? "end" :
                    adjustedAngle === 90 ? "middle" :
                    adjustedAngle < 270 ? "start" :
                    adjustedAngle === 270 ? "middle" :
                    "end" // last case is if it's greater than 270
                const alignmentBaseline = 
                    adjustedAngle === 0 ? "middle" :
                    adjustedAngle < 180 ? "baseline" :
                    adjustedAngle === 180 ? "middle" :
                    "hanging" // last case is if it's greater than 270

                return (
                    <g key={marker} id={`${marker}-wrapper`}>
                        <path 
                            d={`
                                M ${sector.startOuterPoint.x} ${sector.startOuterPoint.y}
                                L ${outerDashPoint.x} ${outerDashPoint.y}
                            `}
                            stroke={stroke}
                            strokeWidth={strokeWidth}
                            className={outlineClassName}
                        />
                        <text
                            x={textPosition.x}
                            y={textPosition.y} 
                            fill={stroke}
                            alignmentBaseline={alignmentBaseline}
                            textAnchor={textAnchor}
                            className={markerClassName}
                        >{marker}</text> 
                    </g> 
                )
            })

        // } else if (markerStyle === "inline") {
        //     return markers.map((marker, index) => {
        //         if (!marker) return // return if marker is empty string

        //         const sector = sectorData[index]
        //         const adjustedAngle = sector.startAngle >= 360 ? sector.startAngle - 360 : sector.startAngle // ensure angle is within 360 degrees

        //         const textPosition = polarToRect(center, center, outerCircleRadius-10, adjustedAngle)

        //         const alignmentBaseline = 
        //             adjustedAngle === 0 ? "middle" :
        //             adjustedAngle < 180 ? "baseline" :
        //             adjustedAngle === 180 ? "middle" :
        //             "hanging" // last case is if it's greater than 270

        //         return (
        //             <g 
        //                 key={marker} 
        //                 id={`${marker}-wrapper`}
        //                style={{
        //                    transform: "rotate(180deg)",
        //                    transformOrigin: `${textPosition.x}px ${textPosition.y}px`
        //                }}

        //             >
        //                 <text
        //                     x={textPosition.x}
        //                     y={textPosition.y} 
        //                     className="text-xs"
        //                     fill={stroke}
        //                     style={{
        //                         transform: `rotate(${adjustedAngle}deg)`,
        //                         transformOrigin: `${textPosition.x}px ${textPosition.y}px`
        //                     }}
        //                     alignmentBaseline={alignmentBaseline}
        //                     textAnchor="start"
        //                 >{marker}</text> 
        //             </g> 
        //         )

        //     })

        } else {
            throw new Error("Marker style can only be equal to the strings: 'outside', 'inline', or 'none'")
        }
    }

    // ------------ RETURN ------------ //

    return (
        <svg width={limitingDimension} height={limitingDimension} overflow="visible" className={svgClassName}>
            <g id="sector-wrapper">
                {Outline()}
            </g>
            <g id="time-markers-wrapper">
                {Markers()}
            </g>
            { children }
        </svg>
    )
}