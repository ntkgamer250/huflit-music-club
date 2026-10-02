import React, { useRef } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { sound } from '../../lib/audioSynth'
import { ReferenceOverlay } from '../common/ReferenceOverlay'
import { HeroParticlesBack, HeroParticlesFront } from '../effects/HeroFallingParticles'

interface HeroSceneProps {
  onOpenRegister: () => void
  onExplore: () => void
  showReferenceOverlay?: boolean
}

export const HeroScene: React.FC<HeroSceneProps> = ({ onOpenRegister, onExplore, showReferenceOverlay = false }) => {
  const heroRef = useRef<HTMLElement>(null)

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full min-h-screen lg:min-h-[105vh] flex flex-col items-center justify-start overflow-visible pt-24 sm:pt-30 lg:pt-32 pb-12 sm:pb-16 select-none bg-transparent"
    >
      {/* Reference Overlay (toggled via 'R') */}
      <ReferenceOverlay
        src="/assets/music-club/scene-01-hero/reference.png"
        show={showReferenceOverlay}
      />

      {/* LAYER 1: Background - Concert Stage with Bottom Vertical Fade Mask */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 80%, rgba(0,0,0,0.4) 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 80%, rgba(0,0,0,0.4) 92%, transparent 100%)',
        }}
      >
        <img
          src="/assets/music-club/scene-01-hero/background.png"
          alt="Concert Stage Background"
          className="w-full h-full object-cover object-center scale-100"
          loading="eager"
        />
        {/* Deep ambient gradient overlay for smooth visual blending */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050D1A]/60 via-transparent to-[#050D1A]/80" />
      </div>

      {/* LAYER 2: Stage Lights Left & Right */}
      <div className="hero-light-left absolute top-0 left-0 w-full md:w-1/2 h-full z-[2] pointer-events-none opacity-85 mix-blend-screen animate-light-sway-left">
        <img
          src="/assets/music-club/scene-01-hero/stage_light_left.png"
          alt="Stage Light Left"
          className="w-full h-auto object-contain object-top-left"
          loading="eager"
        />
      </div>
      <div className="hero-light-right absolute top-0 right-0 w-full md:w-1/2 h-full z-[2] pointer-events-none opacity-85 mix-blend-screen animate-light-sway-right">
        <img
          src="/assets/music-club/scene-01-hero/stage_light_right.png"
          alt="Stage Light Right"
          className="w-full h-auto object-contain object-top-right"
          loading="eager"
        />
      </div>

      {/* LAYER 3: Stage Smoke Atmosphere */}
      <div
        className="hero-smoke absolute inset-0 z-[3] pointer-events-none opacity-70 mix-blend-screen"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 82%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 82%, transparent 100%)',
        }}
      >
        <img
          src="/assets/music-club/scene-01-hero/smoke.png"
          alt="Stage Smoke"
          className="w-full h-full object-cover object-bottom"
          loading="eager"
        />
      </div>

      {/* LAYER 3.5: Back Falling Particles (Far & Mid Layers behind mic & content - z-index 15) */}
      <HeroParticlesBack />

      {/* LAYER 4: Center HTML Content Group (Eyebrow, Heading, Description, Buttons) */}
      <div className="hero-content relative z-30 max-w-5xl mx-auto px-4 text-center flex flex-col items-center mt-2 sm:mt-6">
        {/* Eyebrow */}
        <div className="hero-eyebrow flex items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-5">
          <span className="w-6 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#70D7FF]/80" />
          <span className="text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.35em] text-[#70D7FF] font-semibold uppercase flex items-center gap-1.5 glow-text-cyan">
            <Sparkles className="w-3.5 h-3.5 inline-block" />
            HUFLIT MUSIC CLUB
          </span>
          <span className="w-6 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#70D7FF]/80" />
        </div>

        {/* Main Heading */}
        <h1 className="hero-heading font-serif-display text-[2.25rem] leading-[1.08] sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-tight text-white mb-3.5 sm:mb-5 max-w-4xl">
          <span className="text-white drop-shadow-[0_2px_15px_rgba(255,255,255,0.3)]">JOIN THE </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#70D7FF] via-[#398BFF] to-[#70D7FF] glow-text-cyan">
            RHYTHM
          </span>
        </h1>

        {/* Subtitle / Description */}
        <p className="hero-desc font-sans text-sm sm:text-base md:text-lg text-[#91A4BB] max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 text-balance">
          Nơi những người yêu âm nhạc cùng kết nối, biểu diễn và tạo nên những khoảnh khắc đáng nhớ bằng đam mê và sáng tạo.
        </p>

        {/* Action Buttons */}
        <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 w-full sm:w-auto max-w-xs sm:max-w-none">
          <button
            type="button"
            onClick={() => {
              sound.playClick()
              onOpenRegister()
            }}
            onMouseEnter={() => sound.playHover()}
            className="w-full sm:w-auto btn-primary-glow flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold text-white tracking-wide cursor-pointer shadow-[0_0_25px_rgba(57,139,255,0.6)] hover:scale-105 active:scale-95 transition-all"
          >
            <span>Đăng ký CTV</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick()
              onExplore()
            }}
            onMouseEnter={() => sound.playHover()}
            className="w-full sm:w-auto btn-secondary-glow flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-full text-sm sm:text-base font-medium text-[#F4F7FB] tracking-wide cursor-pointer hover:text-[#70D7FF] active:scale-95 transition-all"
          >
            <span>Khám phá CLB</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* LAYER 5 & 6: Main Object (Microphone) & Soundwave Wrapper */}
      <div className="relative z-20 w-full max-w-4xl flex items-center justify-center -mt-4 sm:-mt-8 md:-mt-10 mb-[-4%] pointer-events-none">
        {/* Microphone Container */}
        <div className="hero-mic relative w-[240px] sm:w-[360px] md:w-[460px] lg:w-[520px] aspect-[4/5] flex items-center justify-center">
          {/* Main Object Microphone */}
          <img
            src="/assets/music-club/scene-01-hero/main_object_microphone.png"
            alt="Microphone Vintage Stage Centerpiece"
            className="w-full h-full object-contain relative z-20 drop-shadow-[0_10px_40px_rgba(57,139,255,0.35)] animate-mic-float"
            loading="eager"
          />

          {/* Soundwave Glowing Helix wrapping the microphone */}
          <div className="hero-soundwave absolute inset-0 z-20 mix-blend-screen pointer-events-none scale-105 sm:scale-110 translate-y-3">
            <img
              src="/assets/music-club/scene-01-hero/soundwave_main.png"
              alt="Electric Soundwave Ribbon"
              className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(112,215,255,0.8)] animate-soundwave-glow"
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* LAYER 7: Front Falling Particles (Low density 3D foreground floating across spotlights - z-index 35) */}
      <HeroParticlesFront />
    </section>
  )
}
