import { memo, useMemo } from "react"
import { useWheelContext } from "../context/wheel-provider";
import { calculateSectorTextData, generateSingleArc } from "../functions/wheel-calculation-functions";
import type { Event } from "../types/event";

// Type for ritual instance arc props - Event without activeWheels
type RitualInstanceArcProps = Omit<Event<never>, 'activeWheels'>;

export default memo(function RitualInstanceSector({ 
    startAngle,
    endAngle,
    title,
    fillColor,
    stroke,
    strokeWidth,
    ariaLabel,
    onClick,
    onMouseEnter,
    onMouseLeave,
    cornerRadius=6,
    padAngle=0.005,
    radialPadding=3,
    pathClassName,
    textClassName

}: RitualInstanceArcProps) {

    const state = useWheelContext()

    if (!state) return

    const center = state.dimensions.center
    const outerCircleRadius = state.dimensions.outerCircleRadius
    const innerCircleRadius = state.dimensions.innerCircleRadius

    // TODO: account for startingPoint (springPoint)
    // const sp = 6

    function calculateSectorData() {
        // returns text data (textCenter, textAngle, textOffset, flipText)
        const { tc, ta, to, ft } = calculateSectorTextData(center, outerCircleRadius, startAngle, endAngle)

        // returns path data
        const pathData = generateSingleArc(startAngle, endAngle, outerCircleRadius, innerCircleRadius, cornerRadius, padAngle, radialPadding)

        return { pathData, tc, ta, to, ft }
    }

    // memoized sector data
    const { pathData, tc, ta, to, ft } = useMemo(() => calculateSectorData(), [center, outerCircleRadius, innerCircleRadius, startAngle, endAngle, cornerRadius, padAngle, radialPadding])

    return (
        <g transform={`translate(${center}, ${center})`}>
            <path 
                d={pathData}
                fill={fillColor}
                stroke={stroke}
                strokeWidth={strokeWidth}
                className={pathClassName}
                role="button"
                tabIndex={0}
                aria-label={ariaLabel}
                onClick={onClick}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (onClick) onClick(e as any);
                    }
                }}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            />
            <text
                x={ft ? tc.x - center - to : tc.x - center + to} 
                y={tc.y - center}
                textAnchor={ft ? "end" : "start"} 
                alignmentBaseline="central"
                style={{transform: `rotate(${ft ? ta + 180 : ta}deg)`, transformOrigin: `${tc.x - center}px ${tc.y - center}px`}}
                className={textClassName}
            >{title}</text>
        </g>
    )
})
