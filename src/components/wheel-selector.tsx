import { polarToRect } from "../functions/polar-coordinate-functions"
import { type Dispatch, type KeyboardEvent, type MouseEvent, type ReactNode, type SetStateAction, memo } from "react"
import { generateArcSequence } from "../functions/wheel-calculation-functions";

interface WheelDaySelectorProps<T extends readonly string[]> {
    center: number;
    innerCircleRadius: number;

    // required props
    wheels: T;
    activeWheel: T[number];
    setActiveWheel: Dispatch<SetStateAction<T[number]>>;

    // styling props
    pathClassName?: string; // classNames for path selectors
    activePathClassName?: string; // additional classNames for when a path selector is active
    textClassName?: string; // classNames for path text
    activeTextClassName?: string; // additional classNames for the text when its path is active
    middleButtonClassName?: string; // classNames for the middle button (will default to pathClassNames if nothing is provided)
    middleButtonActiveClassName?: string // classNames for the middle button if it is a selector (defaults to activePathClassName is nothing is provided)
    middleButtonTextClassName?: string
    middleButtonActiveTextClassName?: string

    // optional props
    radialPadding?: number;
    padAngle?: number;
    cornerRadius?: number;
    startingPoint?: "left" | "top" | "right" | "bottom" | number;
    labelCharacterLength?: number; // how many characters the wheel labels should be, default 3

    // middle button props
    useMiddleButton?: boolean;
    middleButtonRadius?: number;
    middleButtonType?: "selector" | "button"; // whether the middle button should select a wheel 
    middleButtonSelector?: T[number];
    middleButtonAction?: (e: MouseEvent<SVGElement> | KeyboardEvent<SVGElement>) => void
    middleButtonIcon?: ReactNode;
    middleButtonLabel?: string;
    middleButtonAriaLabel?: string;
}

export default memo(function WheelDaySelector<T extends readonly string[]>({
    center,
    innerCircleRadius,

    wheels,
    activeWheel,
    setActiveWheel,
    startingPoint = "top",
    radialPadding = 5,
    padAngle = 0.04,
    cornerRadius = 6,
    labelCharacterLength = 3,

    pathClassName, 
    activePathClassName, 
    textClassName, 
    activeTextClassName,
    middleButtonClassName,
    middleButtonActiveClassName,
    middleButtonTextClassName,
    middleButtonActiveTextClassName,

    useMiddleButton = false,
    middleButtonRadius,
    middleButtonType,
    middleButtonSelector,
    middleButtonAction,
    middleButtonIcon,
    middleButtonLabel,
    middleButtonAriaLabel

}: WheelDaySelectorProps<T>) {

    // middle button error handling
    if (useMiddleButton) {
        if (!middleButtonType) {
            throw new Error("You have useMiddleButton set as true but have not provided a value for middleButtonType. If you are going to use the middle button, you have to supply a value for middleButtonType so that it knows how to behave.")
        }
        if (middleButtonType === "selector") {
            // if middleButtonType is 'selector', then there MUST be a supplied value for middleButtonSelector
            if (!middleButtonSelector) {
                throw new Error("You have middle button set as type 'selector' and have failed to provide a selector value. If you set the middle button as type 'selector', then you must supply a value for 'middleButtonSelector'.")
            }
        } else if (middleButtonType === "button") {
            // if middleButtonType is 'button' then there MUST be a supplied value for middleButtonAction
            if (!middleButtonAction) {
                throw new Error("You have middle button set as type 'button' and have failed to provide a button action. If you set the middle button as type 'button', then you must supply a value for 'middleButtonAction'.")
            // if middleButtonType is 'button', then there MUST be a supplied value for either 'middleIconButton' or 'middleButtonLabel'
            } else if (!middleButtonIcon && !middleButtonLabel) {
                throw new Error("You have middle button set as type 'button' and have failed to provide a value for either 'middleButtonIcon' or 'middleButtonLabel'. If you set the middle button as type 'button', then you must supply a value for either 'middleButtonIcon' or 'middleButtonLabel'.")
            // if middleButtonType is 'button', then there SHOULD be a supplied value for middleButtonAriaLabel
            } else if (!middleButtonAriaLabel) {
                console.error("You have middle button set as type 'button' but have not provided a value for middleButtonAriaLabel. Screen readers will be unable to read the function of your custom button without this prop.")
            }
        }
    // if useMiddleButton is set to false, then there SHOULD NOT be supplied values for any other middle button props
    } else if (middleButtonType || middleButtonSelector || middleButtonAction || middleButtonIcon || middleButtonLabel || middleButtonAriaLabel) {
        console.error("You have 'useMiddleButton' set as false but you have also provided a value for another middle button prop. You must set 'useMiddleButton' as true for any of the other middle button props to be useful.")
    }

    // default value for middleButtonRadius
    const middleButtonRadiusValue = useMiddleButton ? (middleButtonRadius ? middleButtonRadius : innerCircleRadius * 0.36) : cornerRadius  

    // Subtracts one from default wheels length if the middle button will be used as a selector
    const wheelsLength = middleButtonType === 'selector' ? wheels.length - 1 : wheels.length;

    // Filters out middleButtonSelector value from wheels array (for use in the middle button) if middle button will be used as a selector 
    const wheelsArray = middleButtonType === 'selector' ? wheels.filter(wheel => wheel !== middleButtonSelector) : wheels

    const startingAngle: number = 
        startingPoint === "left" ? 0 :
        startingPoint === "top" ? 90 : 
        startingPoint === "right" ? 180 :
        startingPoint === "bottom" ? 270 :
        startingPoint // if it is a number

    const paths =  generateArcSequence(
        wheelsLength, 
        startingAngle, 
        innerCircleRadius, 
        middleButtonRadiusValue, 
        cornerRadius, 
        padAngle, 
        radialPadding
    )

    function handleMiddleButtonClick(e: MouseEvent<SVGElement> | KeyboardEvent<SVGElement>) {
        if (middleButtonType === "selector") {
            setActiveWheel(middleButtonSelector!) // We know that the code passed the error handling check so middleButtonSelector must be truthy
        } else if (middleButtonType === "button") {
            middleButtonAction!(e) // Again, we know that the code passed the error handling so middleButtonAction must be truthy
        } else {
            // we do know that middleButtonType should be truthy at this point but here's a console error just in case
            console.error("You have attempted to press the middle button without supplying a value for middleButtonType. Thus, the middle button does not know how to behave!")
            return
        }
    }

    return (
        <g id="react-circular-calendar-celector-container">
            {/* Path buttons */}
            <g id="selector-paths-container">
                {wheels.map((wheel, index) => (
                    <path 
                        key={wheel}
                        role="button" 
                        transform={`translate(${center}, ${center})`}
                        tabIndex={0} 
                        aria-label={`Select ${wheel} Rituals`}
                        onClick={() => setActiveWheel(wheel)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault(); // Prevent default scrolling behavior for Space
                                setActiveWheel(wheel)
                            }
                        }}
                        d={paths[index]}
                        className={`focus:outline-none ${activeWheel === wheel ? activePathClassName : pathClassName}`}
                        // className={`${activeWheel === wheel ? "fill-white/10 stroke-white/50" : "fill-transparent hover:fill-white/5 stroke-white/10 hover:stroke-white/30"} focus:outline-none cursor-pointer`}
                    />
                ))}
            </g>

            {/* Wheel Labels */}
            <g id="selector-text-container">
                {wheelsArray.map((wheel, index) => {
                    const angle = 360 / wheelsLength
                    const textAngle = angle * index + angle / 2 + startingAngle
                    const textRadius = useMiddleButton ? (middleButtonRadiusValue + innerCircleRadius + radialPadding) / 2 : (middleButtonRadiusValue + innerCircleRadius + radialPadding) / 1.5
                    const xy = polarToRect(center, center, textRadius, textAngle)

                    return (
                        <text
                            key={wheel}
                            x={xy.x}
                            y={xy.y}
                            textAnchor="middle"
                            alignmentBaseline="central"
                            className={`${activeWheel === wheel ? activeTextClassName : textClassName}`}
                            style={{ pointerEvents: "none" }}
                        >{wheel.slice(0, labelCharacterLength)}</text>
                    )
                })}
            </g>

            {/* Middle button */}
            {useMiddleButton && 
                <g id="selector-middle-button-container">
                    <circle
                        cx={center} cy={center} r={middleButtonRadiusValue}
                        role="button" tabIndex={0} aria-label="Select Daily Rituals"
                        onClick={(e) => handleMiddleButtonClick(e)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault(); // Prevent default scrolling behavior for Space
                                handleMiddleButtonClick(e)
                            }
                        }}
                        className={`${middleButtonClassName || pathClassName} ${middleButtonType === "selector" ? middleButtonActiveClassName || activePathClassName : ""}`}
                    />

                    {!middleButtonIcon ?
                        <text
                            x={center}
                            y={center}
                            alignmentBaseline="central"
                            textAnchor="middle"
                            style={{ pointerEvents: "none" }}
                            className={`${activeWheel === middleButtonSelector ? middleButtonActiveTextClassName || activeTextClassName : middleButtonTextClassName || textClassName}`}
                        >{middleButtonLabel || middleButtonSelector?.slice(0, labelCharacterLength)}</text> // prefer the middleButtonLabel if truthy with the selector value as a fallback
                    
                       : <foreignObject 
                            width={middleButtonRadiusValue * 2} 
                            height={middleButtonRadiusValue * 2} 
                            x={center-middleButtonRadiusValue} 
                            y={center-middleButtonRadiusValue}
                            style={{ pointerEvents: "none" }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "100%",
                                    height: "100%"
                                }}
                            >
                                {middleButtonIcon}
                            </div>
                        </foreignObject>
                    }
                </g>
            }
        </g>
    )
})