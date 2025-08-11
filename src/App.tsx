import { useRef, useState } from 'react'
import './App.css'
import WheelOutline from './components/wheel-outline'
import WheelProvider from './context/wheel-provider'
import WheelFunction from './components/wheel-function'
import type { Event } from './types/event'

function CircularCalendar() {
  const markers = ["6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"]
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const
  const today = new Date().getDay()
  const [day, setDay] = useState<typeof days[number]>(days[today])



  const events: Event<typeof days>[] = [
    {
        startAngle: 0,
        endAngle: 30,
        title: "Morning Exercise",
        activeWheels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        fillColor: "url(#rose-gradient)"
    },
    {
        startAngle: 45,
        endAngle: 90,
        title: "Work Meeting",
        activeWheels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        fillColor: "url(#fuscia-gradient)"
    },
    {
        startAngle: 120,
        endAngle: 180,
        title: "Lunch Break",
        activeWheels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        fillColor: "url(#violet-gradient)"
    },
    {
        startAngle: 200,
        endAngle: 240,
        title: "Afternoon Work",
        activeWheels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        fillColor: "url(#indigo-gradient)"
    },
    {
        startAngle: 270,
        endAngle: 300,
        title: "Dinner",
        activeWheels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        fillColor: "url(#sky-gradient)"
    },
    {
        startAngle: 315,
        endAngle: 360,
        title: "Evening Relaxation",
        activeWheels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        fillColor: "url(#zinc-gradient)"
    },
    {
        startAngle: 60,
        endAngle: 120,
        title: "Weekend Activity",
        activeWheels: ["Saturday", "Sunday"],
        fillColor: "url(#emerald-gradient)"
    },
    {
        startAngle: 150,
        endAngle: 210,
        title: "Project Work",
        activeWheels: ["Monday", "Wednesday", "Friday"],
        fillColor: "url(#amber-gradient)"
    },
    {
        startAngle: 240,
        endAngle: 270,
        title: "Team Meeting",
        activeWheels: ["Tuesday", "Thursday"],
        fillColor: "url(#slate-gradient)"
    },
    {
        startAngle: 30,
        endAngle: 60,
        title: "Planning Session",
        activeWheels: ["Monday", "Wednesday", "Friday"],
        fillColor: "url(#rose-gradient)"
    }
  ]

  const defs = 
  <defs>
    <linearGradient id="rose-gradient" gradientTransform="rotate(45)">
        <stop offset="10%" stopColor="#4c0519" />
        <stop offset="30%" stopColor="#600721" />
        <stop offset="50%" stopColor="#740b29" />
        <stop offset="70%" stopColor="#890e31" />
        <stop offset="90%" stopColor="#9f1239" />
    </linearGradient>
    <linearGradient id="fuscia-gradient" gradientTransform="rotate(45)">
        <stop offset="10%" stopColor="#4a044e" />
        <stop offset="30%" stopColor="#58085e" />
        <stop offset="50%" stopColor="#670e6e" />
        <stop offset="70%" stopColor="#77137e" />
        <stop offset="90%" stopColor="#86198f" />
    </linearGradient>
    <linearGradient id="violet-gradient" gradientTransform="rotate(90)">
        <stop offset="10%" stopColor=" #2e1065" />
        <stop offset="30%" stopColor="#391479" />
        <stop offset="50%" stopColor="#44198d" />
        <stop offset="70%" stopColor="#4f1da1" />
        <stop offset="90%" stopColor="#5b21b6" />
    </linearGradient>
    <linearGradient id="indigo-gradient" gradientTransform="rotate(90)">
        <stop offset="10%" stopColor="#1e1b4b" />
        <stop offset="30%" stopColor="#242060" />
        <stop offset="50%" stopColor="#2a2676" />
        <stop offset="70%" stopColor="#302b8c" />
        <stop offset="90%" stopColor="#3730a3" />
    </linearGradient>
    <linearGradient id="sky-gradient" gradientTransform="rotate(90)">
        <stop offset="10%" stopColor="#082f49" />
        <stop offset="30%" stopColor="#093957" />
        <stop offset="50%" stopColor="#094366" />
        <stop offset="70%" stopColor="#094e75" />
        <stop offset="90%" stopColor="#075985" />
    </linearGradient>
    <linearGradient id="zinc-gradient" gradientTransform="rotate(90)">
        <stop offset="10%" stopColor="#09090b" />
        <stop offset="30%" stopColor="#131314" />
        <stop offset="50%" stopColor="#1a1a1c" />
        <stop offset="70%" stopColor="#202023" />
        <stop offset="90%" stopColor="#27272a" />
    </linearGradient>
    <linearGradient id="emerald-gradient" gradientTransform="rotate(90)">
        <stop offset="10%" stopColor="#022c22" />
        <stop offset="30%" stopColor="#02382b" />
        <stop offset="50%" stopColor="#024534" />
        <stop offset="70%" stopColor="#03523d" />
        <stop offset="90%" stopColor="#065f46" />
    </linearGradient>
    <linearGradient id="amber-gradient" gradientTransform="rotate(90)">
        <stop offset="10%" stopColor="#451a03" />
        <stop offset="30%" stopColor="#572309" />
        <stop offset="50%" stopColor="#6a2c0c" />
        <stop offset="70%" stopColor="#7e360d" />
        <stop offset="90%" stopColor="#92400e" />
    </linearGradient>
    <linearGradient id="slate-gradient" gradientTransform="rotate(90)">
        <stop offset="10%" stopColor="#020617" />
        <stop offset="30%" stopColor="#0d121f" />
        <stop offset="50%" stopColor="#131a28" />
        <stop offset="70%" stopColor="#182131" />
        <stop offset="90%" stopColor="#1e293b" />
    </linearGradient>
  </defs>

  return (
    <div className="main-content animate-fade-in-up">
      {/* Wheel Container */}
      <div className="wheel-container">
        <WheelOutline 
          numberOfSectors={12}
          markers={markers}
          startingPoint="left"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={1}
          bgColor='transparent'
          innerCircleBgColor='rgba(0, 0, 0, 0.3)'
          svgClassName="wheel-svg"
        >
          <WheelFunction
            useSelector
            wheels={days}
            activeWheel={day}
            setActiveWheel={setDay}
            events={events}
            eventFillColor="black"
            eventStrokeColor="rgba(255, 255, 255, 0.3)"
            eventTextClassName='event-text'
            svgDefs={defs}
            useMiddleButton
            middleButtonType="selector"
            middleButtonSelector="Sunday"
            middleButtonIcon="🏠"
            selectorPathClassName="selector-path"
            selectorActivePathClassName="selector-path active"
            selectorTextClassName="selector-text"
            selectorActiveTextClassName="selector-text active"
            middleButtonClassName="middle-button"
            middleButtonActiveClassName="middle-button active"
          />
        </WheelOutline>
      </div>
    </div>
  )
}

function App() {
  const ref = useRef(null)

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">React Wheel Calendar</h1>
        <p className="app-subtitle">
          Beautiful circular calendar component with interactive day selection
        </p>
      </header>

      {/* Main wheel container */}
      <div 
        id='wheel-container'
        ref={ref}
        style={{
          height: "700px",
          width: "700px",
          maxWidth: "90vw",
          maxHeight: "90vw"
        }}
      >
        <WheelProvider parentRef={ref}>
          <CircularCalendar />
        </WheelProvider>
      </div>
    </div>
  )
}

export default App
