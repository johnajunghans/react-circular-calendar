## React Circular Calendar

Typed React components for building circular, wheel-style calendars with selectable segments and event arcs.

Only these components are publicly exported:
- WheelProvider
- WheelMain
- WheelFunction

### Install

```bash
npm install react-circular-calendar
# or
yarn add react-circular-calendar
```

Peer dependencies:
- react >= 18
- react-dom >= 18

### Quick Start

```tsx
import { useRef, useState } from 'react'
import { WheelProvider, WheelMain, WheelFunction } from 'react-circular-calendar'

const markers = ["6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"]
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const

function Example() {
  const ref = useRef<HTMLDivElement>(null)
  const [day, setDay] = useState<typeof days[number]>(days[new Date().getDay()])

  // Event objects follow the shape shown below (no type import required):
  const events = [
    { startAngle: 0, endAngle: 30, title: 'Morning Exercise', activeWheels: [...days], fillColor: 'black', stroke: 'white' }
  ]

  return (
    <div ref={ref} style={{ height: 500 }}>
      <WheelProvider>
        <WheelMain parentRef={ref} numberOfSectors={12} markers={markers} bgColor="transparent" stroke="#d9d9d9">
          <WheelFunction
            useSelector
            wheels={days}
            activeWheel={day}
            setActiveWheel={setDay}
            events={events}
            eventFillColor="black"
            eventStrokeColor="white"
            eventTextClassName="fill-white"
          />
        </WheelMain>
      </WheelProvider>
    </div>
  )
}
```

### Component roles and relationship

- **WheelProvider**: Supplies shared sizing/dimension state for the wheel. Must wrap components that read wheel context.
- **WheelMain**: The responsive SVG canvas and outline (sectors/lines, markers). It measures the parent container via a ref, computes dimensions through the provider, and renders the wheel outline. It also renders any children inside the same SVG.
- **WheelFunction**: Renders event arcs and, optionally, a selector (e.g., days of the week). It consumes dimensions from the provider and expects to be a child of `WheelMain` so arcs and selector are drawn on the same canvas.

Typical structure:

```tsx
<WheelProvider>
  <WheelMain parentRef={ref} numberOfSectors={...}>
    <WheelFunction events={...} useSelector wheels={...} activeWheel={...} setActiveWheel={...} />
  </WheelMain>
  {/* you can render other UI outside the SVG here */}
  {/* but anything that should appear on the wheel must be a child of WheelMain */}
  
</WheelProvider>
```

### Event object shape used by WheelFunction

Event objects passed to `WheelFunction` should follow this shape (no import required):

```ts
type Event<T extends readonly string[]> = {
  startAngle: number; // degrees
  endAngle: number;   // degrees
  title: string;
  activeWheels: T[number][]; // which wheels (e.g., days) show this event

  // Optional styling for the arc and label
  cornerRadius?: number;      // default 6
  padAngle?: number;          // default 0.005 (radians) used by arc generator
  radialPadding?: number;     // default 3
  fillColor?: string;
  stroke?: string;
  strokeWidth?: number;
  pathClassName?: string;
  textClassName?: string;

  // Optional handlers and accessibility
  onClick?: (e: React.MouseEvent<SVGPathElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<SVGPathElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<SVGPathElement>) => void;
  ariaLabel?: string;
}
```

### Props

#### WheelProvider

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| children | ReactNode | Yes | — | Children that need access to the wheel context. |
| outerCircleSize | number | No | 90 | Outer circle radius as a percentage of the limiting container dimension. |
| innerCircleSize | number | No | 30 | Inner circle radius as a percentage of the limiting container dimension. |

#### WheelMain

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| children | ReactNode | Yes | — | Elements rendered inside the same SVG (e.g., `WheelFunction`). |
| parentRef | RefObject<HTMLDivElement \| null> | Yes | — | Ref to the container used to measure responsive size. |
| numberOfSectors | number | Yes | — | Number of equal sectors to render. |
| startingPoint | "left" \| "top" \| "right" \| "bottom" \| number | No | "left" | Angle where sectors begin (named positions or degrees). |
| markerStyle | "outside" \| "inline" \| "none" | No | "outside" | Marker rendering style. |
| markers | string[] | No | [] | Marker labels (unique). Use empty string to skip a position. |
| outlineRenderingMethod | "sector" \| "line" | No | "sector" | Outline style: filled sectors or divider lines. |
| svgClassName | string | No | — | Class for the root `<svg>`. |
| bgColor | string | No | "black" | Background color for sectors (when using sector method). |
| innerCircleBg | string | No | "black" | Fill for inner circle when using line method. |
| stroke | string | No | "white" | Outline stroke color. |
| strokeWidth | number | No | 1 | Outline stroke width. |
| outlineSectorClassName | string | No | — | Class for sector paths. Takes precedence over `bgColor`. |
| outlineDividerLineClassName | string | No | — | Class for divider lines. |
| outerCircleClassName | string | No | — | Class for the outer circle. |
| innerCircleClassName | string | No | — | Class for the inner circle. |
| markerTickClassName | string | No | — | Class for marker ticks. |
| markerTextClassName | string | No | — | Class for marker text. |
| minDimensions | number | No | 0 | Minimum size of the SVG in pixels. |
| maxDimensions | number | No | 9999 | Maximum size of the SVG in pixels. |
| resizeDebounceDelay | number | No | 100 | Debounce (ms) for resize calculations. |

#### WheelFunction

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| events | Event<T>[] | Yes | — | Events to render as arcs, filtered by `activeWheel` when selector is used. |
| onClick | (e: MouseEvent<SVGPathElement>) => void | No | — | Default click handler for event arcs (overridden by per-event handler). |
| onMouseEnter | (e: MouseEvent<SVGPathElement>) => void | No | — | Default mouse enter handler for event arcs. |
| onMouseLeave | (e: MouseEvent<SVGPathElement>) => void | No | — | Default mouse leave handler for event arcs. |
| eventRadialPadding | number | No | — | Default radial padding applied to event arcs. |
| eventPadAngle | number | No | — | Default angular padding (radians) for event arcs. |
| eventCornerRadius | number | No | — | Default corner radius for event arcs. |
| eventFillColor | string | No | — | Default fill color for event arcs. |
| eventStrokeColor | string | No | — | Default stroke color for event arcs. |
| eventStrokeWidth | number | No | — | Default stroke width for event arcs. |
| eventPathClassName | string | No | — | Default class for event arc paths. |
| eventTextClassName | string | No | — | Default class for event labels. |
| ariaLabel | string | No | — | Default aria-label for event arcs. |
| eventsGroupClassName | string | No | — | Class for the `<g>` wrapping all events. |
| selectorGroupClassName | string | No | — | Class for the `<g>` wrapping the selector. |
| useSelector | boolean | No | false | Enables the wheel selector UI. When `true`, the next three props are required. |
| wheels | T | Yes (when useSelector) | — | Readonly array of selector options (e.g., days). |
| activeWheel | T[number] | Yes (when useSelector) | — | Currently selected wheel option. |
| setActiveWheel | Dispatch<SetStateAction<T[number]>> | Yes (when useSelector) | — | Setter for the active wheel option. |
| startingPoint | "left" \| "top" \| "right" \| "bottom" \| number | No | — | Starting angle for the selector’s segments. |
| selectorPathClassName | string | No | — | Class for selector paths. |
| selectorActivePathClassName | string | No | — | Extra class when a selector path is active. |
| selectorTextClassName | string | No | — | Class for selector text. |
| selectorActiveTextClassName | string | No | — | Extra class when selector text is active. |
| useMiddleButton | boolean | No | — | Enables a central button (either a selector or a custom action button). |
| middleButtonRadius | number | No | — | Radius of the middle button (auto-calculated if omitted). |
| middleButtonType | "selector" \| "button" | No | — | Behavior of middle button. |
| middleButtonSelector | T[number] | No (Yes when type is `selector`) | — | If type is `selector`, which option to select. |
| middleButtonAction | (e: MouseEvent<SVGElement> \| KeyboardEvent<SVGElement>) => void | No (Yes when type is `button`) | — | If type is `button`, the action to trigger. |
| middleButtonIcon | ReactNode | No | — | Optional icon for the middle button. |
| middleButtonLabel | string | No | — | Optional label for the middle button. |
| middleButtonAriaLabel | string | No (Recommended when type is `button`) | — | Recommended for accessibility when using a custom action button. |
| middleButtonClassName | string | No | — | Class for the middle button (falls back to selector path class). |
| middleButtonActiveClassName | string | No | — | Extra class when middle button is the active selector. |
| middleButtonTextClassName | string | No | — | Class for middle button text. |
| middleButtonActiveTextClassName | string | No | — | Extra class for active middle button text. |
| svgDefs | ReactNode | No | — | Allows custom `<defs>` (e.g., gradients) to be injected for events. |

### License

MIT
