import React from 'react'

interface SpotlightParticle {
  id: string
  type: 'luminous-orb' | 'stardust-spark' | 'ambient-glint' | 'sparkle-4' | 'sparkle-8' | 'music-dust-mote' | 'harmonic-whisper'
  tier: 'far' | 'mid' | 'front'
  zone: 'left-spotlight' | 'right-spotlight' | 'center-mic'
  left: string
  size: number
  opacity: number
  duration: number
  delay: number
  swayClass: string
  shimmerClass: string
  color: string
}

// 24 carefully distributed spotlight particles (38% left spotlight, 38% right spotlight, 24% center/mic)
// 70% light/dust + 20% sparkles + 10% rare musical accents
const BACK_PARTICLES: SpotlightParticle[] = [
  // ================= LEFT SPOTLIGHT CONE (Far & Mid Layers) =================
  {
    id: 'l-far-1',
    type: 'luminous-orb',
    tier: 'far',
    zone: 'left-spotlight',
    left: '6%',
    size: 4,
    opacity: 0.28,
    duration: 15.0,
    delay: -3.2,
    swayClass: 'animate-hero-fall-1',
    shimmerClass: 'animate-dust-twinkle-1',
    color: '#BFE8FF',
  },
  {
    id: 'l-far-2',
    type: 'stardust-spark',
    tier: 'far',
    zone: 'left-spotlight',
    left: '11%',
    size: 4.5,
    opacity: 0.30,
    duration: 16.5,
    delay: -8.5,
    swayClass: 'animate-hero-fall-2',
    shimmerClass: 'animate-dust-twinkle-2',
    color: '#78D7FF',
  },
  {
    id: 'l-far-3',
    type: 'ambient-glint',
    tier: 'far',
    zone: 'left-spotlight',
    left: '17%',
    size: 5,
    opacity: 0.25,
    duration: 14.2,
    delay: -12.0,
    swayClass: 'animate-hero-fall-3',
    shimmerClass: 'animate-dust-twinkle-3',
    color: '#F4FAFF',
  },
  {
    id: 'l-far-4',
    type: 'luminous-orb',
    tier: 'far',
    zone: 'left-spotlight',
    left: '23%',
    size: 3.5,
    opacity: 0.24,
    duration: 17.0,
    delay: -5.4,
    swayClass: 'animate-hero-fall-4',
    shimmerClass: 'animate-dust-twinkle-1',
    color: '#4AA8FF',
  },
  {
    id: 'l-mid-1',
    type: 'sparkle-4',
    tier: 'mid',
    zone: 'left-spotlight',
    left: '9%',
    size: 7.5,
    opacity: 0.48,
    duration: 10.5,
    delay: -4.0,
    swayClass: 'animate-hero-fall-2',
    shimmerClass: 'animate-dust-twinkle-2',
    color: '#F4FAFF',
  },
  {
    id: 'l-mid-2',
    type: 'music-dust-mote', // Rare subtle note
    tier: 'mid',
    zone: 'left-spotlight',
    left: '15%',
    size: 8.5,
    opacity: 0.52,
    duration: 11.2,
    delay: -9.2,
    swayClass: 'animate-hero-fall-3',
    shimmerClass: 'animate-dust-twinkle-3',
    color: '#78D7FF',
  },
  {
    id: 'l-mid-3',
    type: 'stardust-spark',
    tier: 'mid',
    zone: 'left-spotlight',
    left: '21%',
    size: 7,
    opacity: 0.44,
    duration: 10.0,
    delay: -1.8,
    swayClass: 'animate-hero-fall-4',
    shimmerClass: 'animate-dust-twinkle-1',
    color: '#BFE8FF',
  },
  {
    id: 'l-mid-4',
    type: 'luminous-orb',
    tier: 'mid',
    zone: 'left-spotlight',
    left: '27%',
    size: 6.5,
    opacity: 0.38,
    duration: 11.8,
    delay: -7.0,
    swayClass: 'animate-hero-fall-1',
    shimmerClass: 'animate-dust-twinkle-2',
    color: '#4AA8FF',
  },

  // ================= RIGHT SPOTLIGHT CONE (Far & Mid Layers) =================
  {
    id: 'r-far-1',
    type: 'stardust-spark',
    tier: 'far',
    zone: 'right-spotlight',
    left: '73%',
    size: 4.5,
    opacity: 0.28,
    duration: 15.5,
    delay: -10.4,
    swayClass: 'animate-hero-fall-1',
    shimmerClass: 'animate-dust-twinkle-3',
    color: '#78D7FF',
  },
  {
    id: 'r-far-2',
    type: 'luminous-orb',
    tier: 'far',
    zone: 'right-spotlight',
    left: '79%',
    size: 3.5,
    opacity: 0.26,
    duration: 16.2,
    delay: -2.0,
    swayClass: 'animate-hero-fall-2',
    shimmerClass: 'animate-dust-twinkle-1',
    color: '#F4FAFF',
  },
  {
    id: 'r-far-3',
    type: 'ambient-glint',
    tier: 'far',
    zone: 'right-spotlight',
    left: '85%',
    size: 5,
    opacity: 0.30,
    duration: 14.8,
    delay: -7.6,
    swayClass: 'animate-hero-fall-3',
    shimmerClass: 'animate-dust-twinkle-2',
    color: '#BFE8FF',
  },
  {
    id: 'r-far-4',
    type: 'luminous-orb',
    tier: 'far',
    zone: 'right-spotlight',
    left: '92%',
    size: 4,
    opacity: 0.25,
    duration: 17.5,
    delay: -13.0,
    swayClass: 'animate-hero-fall-4',
    shimmerClass: 'animate-dust-twinkle-3',
    color: '#4AA8FF',
  },
  {
    id: 'r-mid-1',
    type: 'sparkle-8',
    tier: 'mid',
    zone: 'right-spotlight',
    left: '75%',
    size: 8,
    opacity: 0.50,
    duration: 10.8,
    delay: -5.0,
    swayClass: 'animate-hero-fall-3',
    shimmerClass: 'animate-dust-twinkle-1',
    color: '#F4FAFF',
  },
  {
    id: 'r-mid-2',
    type: 'harmonic-whisper', // Rare subtle musical arc
    tier: 'mid',
    zone: 'right-spotlight',
    left: '81%',
    size: 8,
    opacity: 0.46,
    duration: 11.5,
    delay: -1.2,
    swayClass: 'animate-hero-fall-4',
    shimmerClass: 'animate-dust-twinkle-2',
    color: '#78D7FF',
  },
  {
    id: 'r-mid-3',
    type: 'stardust-spark',
    tier: 'mid',
    zone: 'right-spotlight',
    left: '87%',
    size: 7,
    opacity: 0.42,
    duration: 10.2,
    delay: -8.8,
    swayClass: 'animate-hero-fall-1',
    shimmerClass: 'animate-dust-twinkle-3',
    color: '#BFE8FF',
  },
  {
    id: 'r-mid-4',
    type: 'luminous-orb',
    tier: 'mid',
    zone: 'right-spotlight',
    left: '94%',
    size: 6.5,
    opacity: 0.36,
    duration: 12.0,
    delay: -3.8,
    swayClass: 'animate-hero-fall-2',
    shimmerClass: 'animate-dust-twinkle-1',
    color: '#4AA8FF',
  },

  // ================= CENTER / MICROPHONE ZONE (Far & Mid Behind Mic) =================
  {
    id: 'c-far-1',
    type: 'luminous-orb',
    tier: 'far',
    zone: 'center-mic',
    left: '36%',
    size: 4,
    opacity: 0.22,
    duration: 15.8,
    delay: -6.5,
    swayClass: 'animate-hero-fall-1',
    shimmerClass: 'animate-dust-twinkle-2',
    color: '#78D7FF',
  },
  {
    id: 'c-far-2',
    type: 'stardust-spark',
    tier: 'far',
    zone: 'center-mic',
    left: '64%',
    size: 4.5,
    opacity: 0.24,
    duration: 16.0,
    delay: -11.5,
    swayClass: 'animate-hero-fall-3',
    shimmerClass: 'animate-dust-twinkle-3',
    color: '#BFE8FF',
  },
  {
    id: 'c-mid-1',
    type: 'ambient-glint',
    tier: 'mid',
    zone: 'center-mic',
    left: '42%',
    size: 7,
    opacity: 0.36,
    duration: 11.0,
    delay: -3.0,
    swayClass: 'animate-hero-fall-4',
    shimmerClass: 'animate-dust-twinkle-1',
    color: '#F4FAFF',
  },
  {
    id: 'c-mid-2',
    type: 'sparkle-4',
    tier: 'mid',
    zone: 'center-mic',
    left: '58%',
    size: 7.5,
    opacity: 0.38,
    duration: 10.6,
    delay: -8.0,
    swayClass: 'animate-hero-fall-2',
    shimmerClass: 'animate-dust-twinkle-2',
    color: '#78D7FF',
  },
]

// 4 Front particles passing in front with subtle 3D parallax
const FRONT_PARTICLES: SpotlightParticle[] = [
  {
    id: 'front-1',
    type: 'ambient-glint',
    tier: 'front',
    zone: 'left-spotlight',
    left: '12%',
    size: 11,
    opacity: 0.65,
    duration: 7.5,
    delay: -2.5,
    swayClass: 'animate-hero-fall-3',
    shimmerClass: 'animate-dust-twinkle-2',
    color: '#F4FAFF',
  },
  {
    id: 'front-2',
    type: 'music-dust-mote', // Rare front note
    tier: 'front',
    zone: 'left-spotlight',
    left: '22%',
    size: 10.5,
    opacity: 0.60,
    duration: 8.2,
    delay: -5.5,
    swayClass: 'animate-hero-fall-1',
    shimmerClass: 'animate-dust-twinkle-3',
    color: '#78D7FF',
  },
  {
    id: 'front-3',
    type: 'stardust-spark',
    tier: 'front',
    zone: 'center-mic',
    left: '39%',
    size: 11.5,
    opacity: 0.55,
    duration: 8.6,
    delay: -1.0,
    swayClass: 'animate-hero-fall-4',
    shimmerClass: 'animate-dust-twinkle-1',
    color: '#BFE8FF',
  },
  {
    id: 'front-4',
    type: 'ambient-glint',
    tier: 'front',
    zone: 'right-spotlight',
    left: '83%',
    size: 11,
    opacity: 0.65,
    duration: 7.8,
    delay: -6.2,
    swayClass: 'animate-hero-fall-2',
    shimmerClass: 'animate-dust-twinkle-3',
    color: '#F4FAFF',
  },
]

function renderParticleShape(type: SpotlightParticle['type']) {
  switch (type) {
    case 'luminous-orb':
      return (
        <svg viewBox="0 0 20 20" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <circle cx="10" cy="10" r="8" fill="currentColor" opacity="0.4" />
          <circle cx="10" cy="10" r="4.5" fill="currentColor" opacity="0.8" />
          <circle cx="10" cy="10" r="2" fill="#FFFFFF" />
        </svg>
      )

    case 'stardust-spark':
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current" preserveAspectRatio="xMidYMid meet">
          <path d="M12 2 C12 7.5 7.5 12 2 12 C7.5 12 12 16.5 12 22 C12 16.5 16.5 12 22 12 C16.5 12 12 7.5 12 2 Z" opacity="0.9" />
          <circle cx="12" cy="12" r="2" fill="#FFFFFF" />
        </svg>
      )

    case 'sparkle-4':
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current" preserveAspectRatio="xMidYMid meet">
          <path d="M12 1 C12 7 7 12 1 12 C7 12 12 17 12 23 C12 17 17 12 23 12 C17 12 12 7 12 1 Z" />
          <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
        </svg>
      )

    case 'sparkle-8':
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current" preserveAspectRatio="xMidYMid meet">
          <path d="M12 1 C12 6.5 7.5 11 2 11 C7.5 11 12 15.5 12 21 C12 15.5 16.5 11 21 11 C16.5 11 12 6.5 12 1 Z" />
          <path d="M12 4.5 C12 8.5 8.5 12 4.5 12 C8.5 12 12 15.5 12 19.5 C12 15.5 15.5 12 19.5 12 C15.5 12 12 8.5 12 4.5 Z" opacity="0.6" transform="rotate(45 12 12)" />
          <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
        </svg>
      )

    case 'ambient-glint':
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <path d="M12 1 L12 23 M1 12 L23 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
          <path d="M5 5 L19 19 M19 5 L5 19" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
          <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.85" />
          <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
        </svg>
      )

    case 'music-dust-mote':
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.3" />
          <path
            d="M9 16.5 a2 2 0 1 1-1.8-1.4 L9 7 l5-1.5 v4 l-5 1.5 v5.5 z"
            fill="currentColor"
            opacity="0.85"
          />
          <circle cx="8" cy="16.5" r="1.2" fill="#FFFFFF" opacity="0.8" />
        </svg>
      )

    case 'harmonic-whisper':
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <circle cx="12" cy="12" r="7" fill="currentColor" opacity="0.25" />
          <path
            d="M8 15 C8 11, 14 11, 14 7 C14 5.5, 12.5 4.5, 11 5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
          <circle cx="8" cy="15" r="1.5" fill="currentColor" opacity="0.9" />
          <circle cx="8" cy="15" r="0.8" fill="#FFFFFF" />
        </svg>
      )
  }
}

// Vertical fade mask: normal in upper/middle, gradually dissolves into smoke around lower mic & fog zone
const FOG_MASK_STYLE: React.CSSProperties = {
  maskImage:
    'linear-gradient(to bottom, black 0%, black 60%, rgba(0,0,0,0.72) 72%, rgba(0,0,0,0.2) 86%, transparent 96%)',
  WebkitMaskImage:
    'linear-gradient(to bottom, black 0%, black 60%, rgba(0,0,0,0.72) 72%, rgba(0,0,0,0.2) 86%, transparent 96%)',
}

// Layer 1: Behind Microphone (Far & Mid Particles - z-index 15)
export const HeroParticlesBack: React.FC = () => {
  return (
    <div
      className="hero-particles hero-particles-back absolute inset-0 pointer-events-none z-[15] overflow-hidden select-none mix-blend-screen"
      style={FOG_MASK_STYLE}
      aria-hidden="true"
    >
      {BACK_PARTICLES.map((particle) => {
        // Spotlight interaction: Higher glow & brightness inside spotlight zones
        const glowFilter =
          particle.zone !== 'center-mic'
            ? 'drop-shadow(0 0 4px rgba(120, 215, 255, 0.75)) drop-shadow(0 0 8px rgba(74, 168, 255, 0.35))'
            : 'drop-shadow(0 0 3px rgba(120, 215, 255, 0.45))'

        return (
          <div
            key={particle.id}
            className={`absolute top-0 will-change-transform ${particle.swayClass}`}
            style={{
              left: particle.left,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              color: particle.color,
              filter: glowFilter,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              animationIterationCount: 'infinite',
              animationTimingFunction: 'linear',
            }}
          >
            <div
              className={`w-full h-full ${particle.shimmerClass}`}
              style={{ opacity: particle.opacity }}
            >
              {renderParticleShape(particle.type)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Layer 2: In Front of Microphone (Front Particles - z-index 35, low density)
export const HeroParticlesFront: React.FC = () => {
  return (
    <div
      className="hero-particles hero-particles-front absolute inset-0 pointer-events-none z-[35] overflow-hidden select-none mix-blend-screen"
      style={FOG_MASK_STYLE}
      aria-hidden="true"
    >
      {FRONT_PARTICLES.map((particle) => {
        const glowFilter =
          'drop-shadow(0 0 6px rgba(120, 215, 255, 0.85)) drop-shadow(0 0 12px rgba(74, 168, 255, 0.45))'

        return (
          <div
            key={particle.id}
            className={`absolute top-0 will-change-transform ${particle.swayClass}`}
            style={{
              left: particle.left,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              color: particle.color,
              filter: glowFilter,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              animationIterationCount: 'infinite',
              animationTimingFunction: 'linear',
            }}
          >
            <div
              className={`w-full h-full ${particle.shimmerClass}`}
              style={{ opacity: particle.opacity }}
            >
              {renderParticleShape(particle.type)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
