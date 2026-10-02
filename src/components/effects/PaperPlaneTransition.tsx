import React from 'react'

export const PaperPlaneTransition: React.FC = () => {
  return (
    <div
      className="scene34-transition paper-plane-transition fixed inset-0 pointer-events-none z-[18] overflow-hidden select-none"
      aria-hidden="true"
    >
      <div className="paper-planes-layer">
        {/* Single Center Paper Plane */}
        <div className="paper-plane plane-center">
          <img src="/assets/music-club/shared/paper-plane.png" alt="Paper Plane" />
          <span className="plane-trail" />
        </div>
      </div>
    </div>
  )
}
