import type { MouseEvent } from "react";

export type Event<T extends readonly string[]> = {
    // Required
    startAngle: number; // in degrees
    endAngle: number; // in degrees
    title: string;
    activeWheels: T[number][]; // all the wheels where the event should be displayed
    
    // Arc appearance
    cornerRadius?: number; // default 6
    padAngle?: number; // default 0.005
    radialPadding?: number; // the amount subtracted from the outer and inner radius of the arc to create padding between the edges of the inner and outer circles, default 3

    // Styling
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    sectorClassName?: string; 
    textClassName?: string;

    // Event Handler Props
    onClick?: (event: MouseEvent<SVGPathElement>) => void;
    onMouseEnter?: (event: MouseEvent<SVGPathElement>) => void;
    onMouseLeave?: (event: MouseEvent<SVGPathElement>) => void;

    // Other Props
    ariaLabel?: string;
}