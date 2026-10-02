import React from 'react'

export const GameToContactTransition: React.FC = () => {
  return (
    <div className="relative w-full h-32 sm:h-44 -my-14 sm:-my-20 z-20 pointer-events-none overflow-hidden flex items-center justify-center">
      {/* Bottom Connector Layer Asset */}
      <div className="absolute inset-0 w-full h-full mix-blend-screen opacity-90 flex items-center justify-center">
        <img
          src="/assets/music-club/scene-03-minigame/bottom_connector.png"
          alt="Scene Connector Soundwave"
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      {/* Gentle Warm Light Gradient Bleed Into Studio */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#050D1A] via-[#071A33]/40 to-transparent" />
    </div>
  )
}
