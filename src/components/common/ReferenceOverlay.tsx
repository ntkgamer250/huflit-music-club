import React from 'react'

interface ReferenceOverlayProps {
  src: string
  show: boolean
}

export const ReferenceOverlay: React.FC<ReferenceOverlayProps> = ({ src, show }) => {
  if (!show) return null
  return (
    <img
      src={src}
      alt="Design Reference Target Overlay"
      className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[9999] opacity-30 select-none"
    />
  )
}
