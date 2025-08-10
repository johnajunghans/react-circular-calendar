import { type Dispatch, type KeyboardEvent, type MouseEvent, type ReactNode, type SetStateAction } from "react"
import WheelDaySelector from "./wheel-selector"
import RitualInstanceArc from "./wheel-event";
import { useMemo } from "react";
import type { Event } from "../types/event";
import { useWheelContext } from "../context/wheel-provider";

interface WheelFunctionProps<T extends readonly string[]> {
    // ----------- EVENT PROPS ------------ // 
    events: Event<T>[];

    // Event Function Props
    onClick?: (event: MouseEvent<SVGPathElement>) => void;
    onMouseEnter?: (event: MouseEvent<SVGPathElement>) => void;
    onMouseLeave?: (event: MouseEvent<SVGPathElement>) => void;

    // Event Styling Props
    eventRadialPadding?: number;
    eventPadAngle?: number;
    eventCornerRadius?: number;
    eventFillColor?: string;
    eventStrokeColor?: string;
    eventStrokeWidth?: number;
    eventPathClassName?: string; 
    eventTextClassName?: string;
    ariaLabel?: string;

    // ----------- SELECTOR PROPS ------------ // 
    useSelector?: boolean;
    wheels?: T; // readonly string array that will determine T
    activeWheel?: T[number];
    setActiveWheel?: Dispatch<SetStateAction<T[number]>>;

    startingPoint?: "left" | "top" | "right" | "bottom" | number;

    // Selector Styling Props
    selectorPathClassName?: string; // classNames for path selectors
    selectorActivePathClassName?: string; // additional classNames for when a path selector is active
    selectorTextClassName?: string; // classNames for path text
    selectorActiveTextClassName?: string; // additional classNames for the text when its path is active

    // Middle Button Props
    useMiddleButton?: boolean;
    middleButtonRadius?: number;
    middleButtonType?: "selector" | "button"; // whether the middle button should select a wheel 
    middleButtonSelector?: T[number];
    middleButtonAction?: (e: MouseEvent<SVGElement> | KeyboardEvent<SVGElement>) => void
    middleButtonIcon?: ReactNode;
    middleButtonLabel?: string;
    middleButtonAriaLabel?: string;

    // Middle Button Styling Props
    middleButtonClassName?: string; // classNames for the middle button (will default to pathClassNames if nothing is provided)
    middleButtonActiveClassName?: string // classNames for the middle button if it is a selector (defaults to activePathClassName is nothing is provided)
    middleButtonTextClassName?: string
    middleButtonActiveTextClassName?: string

    // other props
    svgDefs?: ReactNode; // allows users to define svg defs to create, for example, custom color gradients for svg paths
}

export default function WheelFunction<T extends readonly string[]>({
    events,

    onClick,
    onMouseEnter,
    onMouseLeave,

    useSelector=false,
    wheels,
    activeWheel,
    setActiveWheel,

    eventCornerRadius,
    eventPadAngle,
    eventRadialPadding,
    eventFillColor,
    eventStrokeColor,
    eventStrokeWidth,
    eventPathClassName,
    eventTextClassName,
    ariaLabel,

    selectorPathClassName,
    selectorActivePathClassName,
    selectorTextClassName,
    selectorActiveTextClassName,

    useMiddleButton,
    middleButtonRadius,
    middleButtonType,
    middleButtonSelector,
    middleButtonAction,
    middleButtonIcon,
    middleButtonLabel,
    middleButtonAriaLabel,

    middleButtonClassName,
    middleButtonActiveClassName,
    middleButtonTextClassName,
    middleButtonActiveTextClassName,

    svgDefs

}: WheelFunctionProps<T>) {

    const state = useWheelContext()

    if (!state) return

    const center = state.dimensions.center
    const outerCircleRadius = state.dimensions.outerCircleRadius
    const innerCircleRadius = state.dimensions.innerCircleRadius

    // selector error handling
    if (useSelector) {
        if (!wheels) {
            throw new Error("You have useSelector set as true but have not provided a value for wheels. If you are going to use the selector, you have to supply a value for wheels so that it knows what options are available.")
        }
        if (!activeWheel) {
            throw new Error("You have useSelector set as true but have not provided a value for activeWheel. If you are going to use the selector, you have to supply a value for activeWheel so that it knows which option is currently selected.")
        }
        if (!setActiveWheel) {
            throw new Error("You have useSelector set as true but have not provided a value for setActiveWheel. If you are going to use the selector, you have to supply a value for setActiveWheel so that it can update the selected option.")
        }
    // if useSelector is set to false, then there SHOULD NOT be supplied values for any other selector props
    } else if (wheels || activeWheel || setActiveWheel) {
        console.error("You have 'useSelector' set as false but you have also provided a value for another selector prop. You must set 'useSelector' as true for any of the other selector props to be useful.")
    }

    // filters events based on if they include the activeWheel
    const activeEvents = useMemo(
      () => events.filter(event => event.activeWheels.includes(activeWheel!)),
      [events, activeWheel]
    );

    return (
        <>
            {/* Custom svg defs */}
            {svgDefs}

            {/* Event Mapping */}
            {activeEvents.map(event => (
                <RitualInstanceArc 
                    key={`${event.title}-${event.startAngle}-${event.endAngle}`}
                    center={center}
                    innerCircleRadius={innerCircleRadius}
                    outerCircleRadius={outerCircleRadius}
                    
                    startAngle={event.startAngle}
                    endAngle={event.endAngle}
                    title={event.title}

                    onClick={event.onClick || onClick}
                    onMouseEnter={event.onMouseEnter || onMouseEnter}
                    onMouseLeave={event.onMouseLeave || onMouseLeave}

                    cornerRadius={event.cornerRadius || eventCornerRadius}
                    padAngle={event.padAngle || eventPadAngle}
                    radialPadding={event.radialPadding || eventRadialPadding}

                    fillColor={event.fillColor || eventFillColor}
                    stroke={event.stroke || eventStrokeColor}
                    strokeWidth={event.strokeWidth || eventStrokeWidth}
                    pathClassName={event.pathClassName || eventPathClassName}
                    textClassName={event.textClassName || eventTextClassName}
                    ariaLabel={event.ariaLabel || ariaLabel}
                />
            ))}

            {/* Selector Component */}
            {useSelector && 
                <WheelDaySelector 
                    center={center}
                    innerCircleRadius={innerCircleRadius}

                    // These three values must be defined if the code has reached this point (error handling above verifies this)
                    wheels={wheels!}
                    activeWheel={activeWheel!}
                    setActiveWheel={setActiveWheel!}

                    // Selector styling props
                    pathClassName={selectorPathClassName}
                    activePathClassName={selectorActivePathClassName}
                    textClassName={selectorTextClassName}
                    activeTextClassName={selectorActiveTextClassName}

                    // Middle button props
                    useMiddleButton={useMiddleButton}
                    middleButtonType={middleButtonType}
                    middleButtonSelector={middleButtonSelector}
                    middleButtonRadius={middleButtonRadius}
                    middleButtonAction={middleButtonAction}
                    middleButtonIcon={middleButtonIcon}
                    middleButtonLabel={middleButtonLabel}
                    middleButtonAriaLabel={middleButtonAriaLabel}

                    // Middle button styling props
                    middleButtonClassName={middleButtonClassName}
                    middleButtonActiveClassName={middleButtonActiveClassName}
                    middleButtonTextClassName={middleButtonTextClassName}
                    middleButtonActiveTextClassName={middleButtonActiveTextClassName} 
                />
            }

        </>
    )
}