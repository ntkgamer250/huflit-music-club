import React from 'react'

export const HeroToAboutTransition: React.FC = () => {
  return (
    <div className="relative w-full h-24 sm:h-36 -my-12 sm:-my-16 z-20 pointer-events-none overflow-hidden flex items-center justify-center">
      {/* Continuing Electric Glow Ribbon Connector */}
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <svg
          viewBox="0 0 1200 200"
          className="w-full h-full text-[#70D7FF] opacity-80 filter drop-shadow-[0_0_15px_#70D7FF]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Animated soundwave vertical flow connector */}
          <path
            d="M 600 0 Q 550 50 620 100 T 590 200"
            stroke="url(#soundwave-gradient-1)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 590 10 Q 640 60 580 110 T 610 190"
            stroke="#398BFF"
            strokeWidth="2"
            opacity="0.6"
            strokeDasharray="4 8"
          />
          {/* Equalizer lines along path */}
          {Array.from({ length: 18 }).map((_, i) => {
            const y = 15 + i * 10
            const xOffset = Math.sin(i * 0.45) * 40 + 600
            const len = Math.sin(i * 0.7) * 25 + 15
            return (
              <line
                key={i}
                x1={xOffset - len}
                y1={y}
                x2={xOffset + len}
                y2={y}
                stroke="#70D7FF"
                strokeWidth="1.5"
                opacity={0.3 + (i % 3) * 0.25}
              />
            )
          })}
          <defs>
            <linearGradient id="soundwave-gradient-1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#70D7FF" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#398BFF" stopOpacity="1" />
              <stop offset="100%" stopColor="#70D7FF" stopOpacity="0.85" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}
