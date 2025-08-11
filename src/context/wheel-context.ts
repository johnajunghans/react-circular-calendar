import { createContext } from "react";

// ------------ TYPES ------------ //

export type WheelDimensions = {
    center: number;
    outerCircleRadius: number;
    innerCircleRadius: number;
}

export type WheelData = {
    dimensions: WheelDimensions;
    limitingDimension: number;
} | null

// ------------ CONTEXT ------------ //

export const WheelContext = createContext<WheelData>(null);
