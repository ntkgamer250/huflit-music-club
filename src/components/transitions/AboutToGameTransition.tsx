import React from 'react'

export const AboutToGameTransition: React.FC = () => {
  return (
    <div className="relative w-full h-24 sm:h-32 -my-10 sm:-my-14 z-20 pointer-events-none overflow-hidden flex items-center justify-center">
      {/* Soundwave expanding toward center */}
      <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
        <svg
          viewBox="0 0 1200 180"
          className="w-full h-full text-[#70D7FF] opacity-85 filter drop-shadow-[0_0_20px_#70D7FF]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 200 0 C 400 90, 800 90, 1000 180"
            stroke="url(#soundwave-gradient-2)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 1000 0 C 800 90, 400 90, 200 180"
            stroke="#398BFF"
            strokeWidth="2.5"
            opacity="0.6"
          />
          {/* Energy rings */}
          <circle cx="600" cy="90" r="45" stroke="#70D7FF" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.5" />
          <circle cx="600" cy="90" r="25" stroke="#398BFF" strokeWidth="2" opacity="0.8" />
          <circle cx="600" cy="90" r="8" fill="#70D7FF" className="animate-pulse" />

          <defs>
            <linearGradient id="soundwave-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#70D7FF" />
              <stop offset="50%" stopColor="#398BFF" />
              <stop offset="100%" stopColor="#70D7FF" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}
