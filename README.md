# React Wheel Calendar

[![npm version](https://img.shields.io/npm/v/react-wheel-calendar.svg)](https://www.npmjs.com/package/react-wheel-calendar)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Below is a basic description of the project written by Claude. Handwritten project description coming soon.**

A flexible and customizable React library for creating wheel-based calendar interfaces. This library provides a set of components that work together to create interactive wheel calendar displays, perfect for scheduling applications, time selection interfaces, or any use case requiring a wheel-based date/time picker.

## Features

- **Responsive Design**: Automatically resizes to fit parent container
- **Customizable Styling**: Full control over colors, sizing, and CSS classes
- **Event Management**: Display and interact with events on the circular interface
- **Selector Functionality**: Optional wheel selection with middle button support
- **TypeScript Support**: Full type safety and IntelliSense support
- **Accessibility**: Built-in ARIA labels and keyboard navigation support

## Installation

```bash
npm install react-wheel-calendar
```

## Quick Start

```tsx
import React, { useRef, useState } from 'react';
import { WheelProvider, WheelOutline, WheelFunction } from 'react-wheel-calendar';

const events = [
  {
    title: "Meeting",
    startAngle: 45,
    endAngle: 90,
    activeWheels: ["today"],
    fillColor: "#3b82f6"
  },
  {
    title: "Lunch",
    startAngle: 180,
    endAngle: 210,
    activeWheels: ["today"],
    fillColor: "#10b981"
  }
];

const wheels = ["today", "tomorrow", "this week"] as const;

function WheelCalendar() {
  const parentRef = useRef<HTMLDivElement>(null);
  const [activeWheel, setActiveWheel] = useState<typeof wheels[number]>("today");

  return (
    <div ref={parentRef} style={{ width: '400px', height: '400px' }}>
      <WheelProvider parentRef={parentRef}>
        <WheelOutline
          numberOfSectors={24}
          startingPoint="top"
          markers={["12", "3", "6", "9"]}
          stroke="#374151"
          bgColor="#f9fafb"
        >
          <WheelFunction
            events={events}
            useSelector={true}
            wheels={wheels}
            activeWheel={activeWheel}
            setActiveWheel={setActiveWheel}
            eventFillColor="#3b82f6"
          />
        </WheelOutline>
      </WheelProvider>
    </div>
  );
}

export default WheelCalendar;
```

## Components

### WheelProvider

A React Context Provider for managing wheel calendar state and dimensions. This provider manages the state of a wheel calendar, including its dimensions and provides automatic resize monitoring of the parent container. The wheel dimensions are calculated as percentages of the limiting container dimension.

| Name | Type | Required | Default Value | Description |
|------|------|----------|---------------|-------------|
| children | ReactNode | Yes | - | React nodes to be wrapped by the provider |
| parentRef | RefObject<HTMLDivElement \| null> | Yes | - | Ref of parent div which svg should resize to fit |
| outerCircleSize | number | No | 90 | Percentage (0-100) of the limiting dimension to use for the outer circle radius |
| innerCircleSize | number | No | 30 | Percentage (0-100) of the limiting dimension to use for the inner circle radius |
| minDimensions | number | No | 0 | Minimum size of svg |
| maxDimensions | number | No | 9999 | Maximum size of svg |
| resizeDebounceDelay | number | No | 100 | Number of milliseconds to wait before resizing wheel |

### WheelOutline

A component that renders the structural outline of the wheel calendar. It provides the base SVG structure and visual framework for the calendar, including sector divisions and optional text markers.

| Name | Type | Required | Default Value | Description |
|------|------|----------|---------------|-------------|
| children | ReactNode | Yes | - | Should be WheelFunction component |
| numberOfSectors | number | Yes | - | Number of sectors to divide the wheel into |
| startingPoint | "left" \| "top" \| "right" \| "bottom" \| number | Yes | - | Starting position for the wheel sectors |
| markers | string[] | No | [] | Array of text markers to display on the wheel |
| renderMethod | "sector" \| "line" | No | - | Method for rendering the wheel outline |
| bgColor | string | No | - | Background color for the wheel sectors |
| innerCircleBgColor | string | No | - | Background color for the inner circle |
| stroke | string | No | - | Stroke color for the wheel outline |
| strokeWidth | number | No | - | Width of the stroke lines |
| svgClassName | string | No | - | CSS class name for the SVG element |
| outlineClassName | string | No | - | CSS class name for the outline elements |
| markerClassName | string | No | - | CSS class name for the marker text elements |

### WheelFunction

A comprehensive component that handles the functional aspects of the wheel calendar, including event rendering and optional wheel selection functionality. It manages the display of events within the wheel structure and provides interactive capabilities.

| Name | Type | Required | Default Value | Description |
|------|------|----------|---------------|-------------|
| events | Event<T>[] | Yes | - | Array of events to display on the wheel |
| onClick | (event: MouseEvent<SVGPathElement>) => void | No | - | Click handler for events |
| onMouseEnter | (event: MouseEvent<SVGPathElement>) => void | No | - | Mouse enter handler for events |
| onMouseLeave | (event: MouseEvent<SVGPathElement>) => void | No | - | Mouse leave handler for events |
| eventRadialPadding | number | No | - | Radial padding for event elements |
| eventPadAngle | number | No | - | Padding angle between events |
| eventCornerRadius | number | No | - | Corner radius for event shapes |
| eventFillColor | string | No | - | Fill color for events |
| eventStrokeColor | string | No | - | Stroke color for events |
| eventStrokeWidth | number | No | - | Stroke width for events |
| eventPathClassName | string | No | - | CSS class name for event paths |
| eventTextClassName | string | No | - | CSS class name for event text |
| ariaLabel | string | No | - | Aria label for accessibility |
| useSelector | boolean | No | false | Whether to enable wheel selection functionality |
| wheels | T | No | - | Array of wheel options for selection |
| activeWheel | T[number] | No | - | Currently active/selected wheel |
| setActiveWheel | Dispatch<SetStateAction<T[number]>> | No | - | State setter for active wheel |
| startingPoint | "left" \| "top" \| "right" \| "bottom" \| number | No | - | Starting position for wheel elements |
| selectorPathClassName | string | No | - | CSS class name for selector paths |
| selectorActivePathClassName | string | No | - | Additional CSS class name for active selector paths |
| selectorTextClassName | string | No | - | CSS class name for selector text |
| selectorActiveTextClassName | string | No | - | Additional CSS class name for active selector text |
| useMiddleButton | boolean | No | - | Whether to display a middle button |
| middleButtonRadius | number | No | - | Radius of the middle button |
| middleButtonType | "selector" \| "button" | No | - | Type of middle button functionality |
| middleButtonSelector | T[number] | No | - | Wheel selector for middle button |
| middleButtonAction | (e: MouseEvent<SVGElement> \| KeyboardEvent<SVGElement>) => void | No | - | Action handler for middle button |
| middleButtonIcon | ReactNode | No | - | Icon for the middle button |
| middleButtonLabel | string | No | - | Text label for the middle button |
| middleButtonAriaLabel | string | No | - | Aria label for middle button accessibility |
| middleButtonClassName | string | No | - | CSS class name for the middle button |
| middleButtonActiveClassName | string | No | - | CSS class name for active middle button |
| middleButtonTextClassName | string | No | - | CSS class name for middle button text |
| middleButtonActiveTextClassName | string | No | - | CSS class name for active middle button text |
| svgDefs | ReactNode | No | - | Custom SVG definitions for advanced styling |

## TypeScript Support

This library is written in TypeScript and provides full type definitions. All components are fully typed, including proper generic types for event handling and wheel selection.

## Browser Support

This library supports all modern browsers that support:
- ES6 modules
- SVG rendering
- CSS transforms

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

See [RELEASES](https://github.com/your-username/react-wheel-calendar/releases) for a detailed changelog.