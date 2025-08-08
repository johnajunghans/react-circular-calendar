import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";

export type WheelDimensions = {
    center: number;
    outerCircleRadius: number;
    innerCircleRadius: number;
}

export type WheelData = {
    dimensions: WheelDimensions;
} | null

type WheelDispatchActions = 
    { type: "RESIZE", payload: number } // case "RESIZE" will receive a pay load of an updated limiting dimension

interface WheelContext {
    state: WheelData;
    dispatch: Dispatch<WheelDispatchActions>
}

export interface WheelProviderProps {
    children: ReactNode, 
    outerCircleSize?: number, 
    innerCircleSize?: number 
}

const WheelContext = createContext<WheelContext | undefined>(undefined)

/**
 * WheelProvider - React Context Provider for managing circular calendar wheel state and dimensions
 * 
 * This provider manages the state of a circular calendar wheel, including its dimensions
 * and provides a dispatch function for updating the wheel's size based on container changes.
 * The wheel dimensions are calculated as percentages of the limiting container dimension.
 * 
 * @param children - React nodes to be wrapped by the provider
 * @param outerCircleSize - Percentage (0-100) of the limiting dimension to use for the outer circle radius. Defaults to 90
 * @param innerCircleSize - Percentage (0-100) of the limiting dimension to use for the inner circle radius. Defaults to 30
 * 
 * @example
 * ```tsx
 * <WheelProvider outerCircleSize={85} innerCircleSize={25}>
 *   <CircularCalendar />
 * </WheelProvider>
 * ```
 * 
 * @example
 * ```tsx
 * // Using default sizes
 * <WheelProvider>
 *   <CircularCalendar />
 * </WheelProvider>
 * ```
 */
export const WheelProvider = ({ children, outerCircleSize=90, innerCircleSize=30 }: WheelProviderProps) => {

    const wheelReducer = (state: WheelData, action: WheelDispatchActions) => {
        switch (action.type) {
            case "RESIZE": {
                const limitingDimension = action.payload
                const center = limitingDimension / 2
                const updatedDimensions: WheelDimensions = {
                    center,
                    outerCircleRadius: center * outerCircleSize / 100,
                    innerCircleRadius: center * innerCircleSize / 100 
                }
                return { ...state, dimensions: updatedDimensions }
            };
            default: return state
        }
    }

    const [state, dispatch] = useReducer(wheelReducer, null)

    return (
        <WheelContext.Provider value={{ state, dispatch }}>
            { children }
        </WheelContext.Provider>
    )
}

export const useWheelContext = () => {
    const context = useContext(WheelContext)
    if (!context) {
        throw new Error("React Circular Calendar context is being called outside of its scope!")
    }
    return context 
}