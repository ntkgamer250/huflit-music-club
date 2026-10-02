import React from 'react'

export const SoundWaveLayer: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden select-none opacity-40 mix-blend-screen">
      {/* Subtle global ambient glowing electric lines traversing the background depth */}
      <svg
        className="w-full h-full"
        viewBox="0 0 1000 3000"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 500 0 C 650 300, 300 600, 500 900 C 700 1200, 250 1600, 500 2000 C 750 2400, 350 2700, 500 3000"
          stroke="url(#global-wave-gradient)"
          strokeWidth="1.5"
          strokeDasharray="8 12"
          opacity="0.3"
        />

        <defs>
          <linearGradient id="global-wave-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#70D7FF" stopOpacity="0.4" />
            <stop offset="30%" stopColor="#398BFF" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#70D7FF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#398BFF" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
