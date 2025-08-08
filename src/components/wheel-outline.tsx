import type { ReactNode } from "react";
import { useMemo } from "react";
import { polarToRect } from "../functions/polar-coordinate-functions";
import { generateOutlineLineData, generateOutlineSectorData, type LineData, type SectorData } from "../functions/wheel-calculation-functions";

interface WheelOutlineProps {
    center: number;
    outerCircleRadius: number;
    innerCircleRadius: number,
    numberOfSectors: number;
    outlineRenderingMethod: "sector" | "line";
    bgColor: string;
    innerCircleBg: string;
    stroke: string;
    strokeWidth: number;
    markerStyle: "outside" | "inline" | "none";
    markers: string[];
    startingPoint: "left" | "top" | "right" | "bottom" | number
    // className slots (take precedence over color props for relevant elements)
    sectorClassName?: string;
    dividerLineClassName?: string;
    outerCircleClassName?: string;
    innerCircleClassName?: string;
    markerTickClassName?: string;
    markerTextClassName?: string;
}

export default function WheelOutline({ 
    center, 
    outerCircleRadius,
    innerCircleRadius,
    numberOfSectors,
    outlineRenderingMethod,
    bgColor,
    stroke,
    strokeWidth,
    markerStyle,
    markers,
    startingPoint,
    innerCircleBg,
    sectorClassName,
    dividerLineClassName,
    outerCircleClassName,
    innerCircleClassName,
    markerTickClassName,
    markerTextClassName
}: WheelOutlineProps) {

    // ------------ Outline ------------ //

    // calculation of angle based on possible enum values
    const startingAngle = 
        startingPoint === "left" ? 0 :
        startingPoint === "top" ? 90 : 
        startingPoint === "right" ? 180 :
        startingPoint === "bottom" ? 270 :
        startingPoint // if it is a number

    const pathData = useMemo(() => {
        return outlineRenderingMethod === "line"
            ? generateOutlineLineData(numberOfSectors, center, innerCircleRadius, outerCircleRadius)
            : generateOutlineSectorData(numberOfSectors, center, innerCircleRadius, outerCircleRadius, startingAngle);
    }, [outlineRenderingMethod, numberOfSectors, center, innerCircleRadius, outerCircleRadius, startingAngle]);

    const Outline = () => {
        if (outlineRenderingMethod === "line") {
            return (
                <>
                    <circle cx={center} cy={center} r={outerCircleRadius} className={outerCircleClassName} stroke={outerCircleClassName ? undefined : stroke} fill={outerCircleClassName ? undefined : bgColor} />
                    {(pathData as LineData[]).map(line => (
                        <path 
                            key={line.angle}
                            d={`
                                M ${line.startInnerPoint.x} ${line.startInnerPoint.y}
                                L ${line.startOuterPoint.x} ${line.startOuterPoint.y}
                            `}
                            className={dividerLineClassName}
                            stroke={dividerLineClassName ? undefined : stroke}
                            strokeWidth={dividerLineClassName ? undefined : strokeWidth}
                            fill="none"
                        />
                    ))}
                    <circle cx={center} cy={center} r={innerCircleRadius} className={innerCircleClassName} stroke={innerCircleClassName ? undefined : stroke} fill={innerCircleClassName ? undefined : innerCircleBg} />
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
                        className={sectorClassName}
                        fill={sectorClassName ? undefined : bgColor}
                        stroke={sectorClassName ? undefined : stroke}
                        strokeWidth={sectorClassName ? undefined : strokeWidth}
                    />
                ))
            )
        }
    }

    // ------------ MARKERS ------------ // 
    
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
                            className={markerTickClassName}
                            stroke={markerTickClassName ? undefined : stroke}
                            strokeWidth={markerTickClassName ? undefined : strokeWidth}
                        />
                        <text
                            x={textPosition.x}
                            y={textPosition.y} 
                            className={markerTextClassName}
                            fill={markerTextClassName ? undefined : stroke}
                            alignmentBaseline={alignmentBaseline}
                            textAnchor={textAnchor}
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
        <g id="wheel-outline">
            <g id="sector-wrapper">
                {Outline()}
            </g>
            <g id="time-markers-wrapper">
                {Markers()}
            </g>
        </g>
    )
}