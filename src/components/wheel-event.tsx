import { memo, useMemo } from "react"
import { calculateSectorTextData, generateSingleArc } from "../functions/wheel-calculation-functions";
import type { Event } from "../types/event";

// Type for ritual instance arc props - Event without activeWheels
type WheelEventProps = Omit<Event<never>, 'activeWheels'> & {
    center: number;
    innerCircleRadius: number;
    outerCircleRadius: number;
};

export default memo(function WheelEvent({
    center,
    innerCircleRadius,
    outerCircleRadius,
    
    startAngle,
    endAngle,
    title,
    fillColor,
    strokeColor,
    strokeWidth,
    ariaLabel,
    onClick,
    onMouseEnter,
    onMouseLeave,
    cornerRadius=6,
    padAngle=0.005,
    radialPadding=3,
    sectorClassName,
    textClassName

}: WheelEventProps) {

    // const sp = 6

    // memoized sector data
    const { pathData, tc, ta, to, ft } = useMemo(() => {
        // returns text data (textCenter, textAngle, textOffset, flipText)
        const { tc, ta, to, ft } = calculateSectorTextData(center, outerCircleRadius, startAngle, endAngle)

        // returns path data
        const pathData = generateSingleArc(startAngle, endAngle, outerCircleRadius, innerCircleRadius, cornerRadius, padAngle, radialPadding)

        return { pathData, tc, ta, to, ft }
    }, [center, outerCircleRadius, innerCircleRadius, startAngle, endAngle, cornerRadius, padAngle, radialPadding])

    return (
        <g transform={`translate(${center}, ${center})`}>
            <path 
                d={pathData}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                className={sectorClassName}
                role="button"
                tabIndex={0}
                aria-label={ariaLabel}
                onClick={onClick}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (onClick) onClick(e);
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
                style={{
                    transform: `rotate(${ft ? ta + 180 : ta}deg)`, 
                    transformOrigin: `${tc.x - center}px ${tc.y - center}px`,
                    pointerEvents: "none"
                }}
                className={textClassName}
            >{title}</text>
        </g>
    )
})
