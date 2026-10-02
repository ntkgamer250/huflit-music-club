import React, { useState, useRef } from 'react'
import { Sparkles, ArrowRight, Play } from 'lucide-react'
import { sound } from '../../lib/audioSynth'
import { MusicQuiz } from '../game/MusicQuiz'
import { ReferenceOverlay } from '../common/ReferenceOverlay'

interface MiniGameSceneProps {
  onOpenRegister: () => void
  showReferenceOverlay?: boolean
}

export const MiniGameScene: React.FC<MiniGameSceneProps> = ({ onOpenRegister, showReferenceOverlay = false }) => {
  const [isQuizOpen, setIsQuizOpen] = useState(false)
  const sceneRef = useRef<HTMLElement>(null)

  const handleStartGame = () => {
    sound.playVinylDrop()
    setIsQuizOpen(true)
  }

  return (
    <section
      id="minigame"
      ref={sceneRef}
      className="scene scene-3 relative w-full min-h-screen overflow-hidden select-none bg-[#050D1A]"
      style={{
        isolation: 'isolate',
        paddingBottom: 'clamp(80px, 12vh, 130px)',
      }}
    >
      {/* Reference Overlay (toggled via 'R') */}
      <ReferenceOverlay
        src="/assets/music-club/scene-03-minigame/reference.png"
        show={showReferenceOverlay}
      />

      {/* LAYER 1: Deep Blue Concert Stage Arena Background */}
      <div
        className="minigame-bg absolute inset-0 z-[1] pointer-events-none"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 6%, black 18%, black 86%, rgba(0,0,0,0.35) 94%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 6%, black 18%, black 86%, rgba(0,0,0,0.35) 94%, transparent 100%)',
        }}
      >
        <img
          src="/assets/music-club/scene-03-minigame/scene3_background.jpg"
          alt="Concert Arena Stage Background"
          className="w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.58) contrast(1.18) saturate(1.2)' }}
          loading="lazy"
        />
        {/* Deep Blue Lighting & Vignette Overlays matching the above scenes */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050D1A]/80 via-[#050D1A]/45 to-[#050D1A]/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050D1A]/90 via-transparent to-[#050D1A]/90" />
        <div className="absolute inset-0 bg-[#050D1A]/35" />
      </div>

      {/* LAYER 2: Stage Lights Overlay (z-index 2) - Frames the composition */}
      <div className="minigame-lights absolute inset-0 z-[2] pointer-events-none opacity-45 mix-blend-screen animate-ambient-pulse">
        <img
          src="/assets/music-club/scene-03-minigame/scene3_stage_lights.png"
          alt="Stage Spotlights"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* LAYER 3: Stage Smoke (z-index 3) */}
      <div className="minigame-smoke absolute inset-0 z-[3] pointer-events-none opacity-30 mix-blend-screen">
        <img
          src="/assets/music-club/scene-03-minigame/scene3_smoke.png"
          alt="Stage Smoke"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* LAYER 4: Atmospheric Stage Particles (z-index 4) */}
      <div className="absolute inset-0 z-[4] pointer-events-none opacity-20 mix-blend-screen">
        <img
          src="/assets/music-club/scene-03-minigame/scene3_particles.png"
          alt="Atmospheric Particles"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* LAYER 5: VINYL FOCAL POINT — Main Visual Anchor Centered Behind Content (z-index 5) */}
      <div
        className="minigame-vinyl absolute pointer-events-none z-[5]"
        style={{
          left: '50%',
          top: '38%',
          width: 'clamp(430px, 36vw, 600px)',
          aspectRatio: '1/1',
          transform: 'translate(-50%, -50%)',
          opacity: 0.58,
        }}
      >
        {/* Layer 5A: Pure Circular Ambient Glow (Static / gentle breathing pulse, NO square rotation) */}
        <div
          className="absolute inset-[-14%] pointer-events-none mix-blend-screen opacity-70 animate-ambient-pulse"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(112, 215, 255, 0.40) 0%, rgba(57, 139, 255, 0.16) 45%, transparent 72%)',
            borderRadius: '50%',
          }}
        />

        {/* Layer 5B: Circular Vinyl Record (ONLY this rotates, strict circular boundary with no square box) */}
        <div
          className="vinyl-rotator w-full h-full rounded-full overflow-hidden animate-vinyl-spin-slow pointer-events-none"
          style={{
            clipPath: 'circle(49.5% at 50% 50%)',
            WebkitClipPath: 'circle(49.5% at 50% 50%)',
            borderRadius: '50%',
            transformOrigin: '50% 50%',
          }}
        >
          <img
            src="/assets/music-club/scene-03-minigame/circular_vinyl.jpg"
            alt="Atmospheric Vinyl Record"
            className="w-full h-full object-cover rounded-full select-none"
            style={{
              borderRadius: '50%',
              clipPath: 'circle(49.5% at 50% 50%)',
              WebkitClipPath: 'circle(49.5% at 50% 50%)',
            }}
            loading="lazy"
          />
        </div>
      </div>

      {/* LAYER 6: Subtle Soundwave / Energy Line around Vinyl (z-index 6) */}
      <div
        className="minigame-soundwave absolute pointer-events-none mix-blend-screen opacity-26 z-[6]"
        style={{
          left: '50%',
          top: '38%',
          width: 'clamp(400px, 60vw, 900px)',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <img
          src="/assets/music-club/scene-03-minigame/scene3_soundwave.png"
          alt="Orbital Soundwave"
          className="w-full h-auto object-contain filter drop-shadow-[0_0_18px_#70D7FF] animate-soundwave-glow"
          loading="lazy"
        />
      </div>

      {/* LAYER 7: Floating Neon Music Notes (z-index 7) - Subtle Accent Touches */}
      <div
        className="hidden md:block absolute left-[8%] top-[14%] w-20 h-20 z-[7] mix-blend-screen opacity-35 pointer-events-none animate-note-1"
      >
        <img
          src="/assets/music-club/scene-03-minigame/scene3_music_notes.png"
          alt=""
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
      <div
        className="hidden md:block absolute right-[9%] top-[16%] w-20 h-20 z-[7] mix-blend-screen opacity-30 pointer-events-none animate-note-2"
      >
        <img
          src="/assets/music-club/scene-03-minigame/scene3_music_notes.png"
          alt=""
          className="w-full h-full object-contain scale-x-[-1]"
          loading="lazy"
        />
      </div>

      {/* LAYER 8: CENTERED TITLE GROUP (z-index 12) — Clean, Focused Cinematic Hierarchy */}
      <div
        className="minigame-title-group absolute z-[12] flex flex-col items-center text-center px-4"
        style={{
          left: '50%',
          top: '16%',
          transform: 'translateX(-50%)',
          width: 'min(92vw, 660px)',
        }}
      >
        {/* 1. Eyebrow (top ~16%) */}
        <div className="game-eyebrow flex items-center justify-center gap-3 mb-3">
          <span className="w-8 h-[1px] bg-[#70D7FF]/80" />
          <span className="text-xs sm:text-[13px] tracking-[0.28em] text-[#70D7FF] font-semibold uppercase flex items-center gap-1.5 glow-text-cyan">
            <Sparkles className="w-3.5 h-3.5" />
            MINI GAME
          </span>
          <span className="w-8 h-[1px] bg-[#70D7FF]/80" />
        </div>

        {/* 2. Heading (top ~20-22%): clamp(56px, 5vw, 82px) */}
        <h2
          className="game-heading font-serif-display text-white tracking-tight leading-[1.02] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] mb-4"
          style={{ fontSize: 'clamp(56px, 5vw, 82px)' }}
        >
          <span>MUSIC </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#70D7FF] via-[#398BFF] to-[#70D7FF] glow-text-cyan">
            CHALLENGE
          </span>
        </h2>

        {/* 3. Short Description: max-width 540-580px */}
        <p className="game-desc font-sans text-sm sm:text-base text-[#B0C4DE] max-w-[560px] mx-auto leading-relaxed drop-shadow-md mb-6">
          Thử thách khả năng cảm âm, đoán bài hát và nhận những phần quà thú vị từ CLB nhé!
        </p>

        {/* 4. Single Primary CTA Button: 190–220px width, 54–58px height */}
        <button
          type="button"
          onClick={handleStartGame}
          onMouseEnter={() => sound.playHover()}
          className="btn-primary-glow flex items-center justify-center gap-2.5 rounded-full text-sm sm:text-base font-semibold text-white tracking-wide cursor-pointer shadow-[0_0_25px_rgba(57,139,255,0.6)] hover:scale-105 active:scale-95 transition-all"
          style={{ width: 'clamp(190px, 22vw, 215px)', height: '56px' }}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Bắt đầu chơi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* LAYER 9: LOWER FOREGROUND — Subtle Stage Floor Glow & Faint Crowd (z-index 20) */}
      <div
        className="minigame-crowd absolute z-[20] pointer-events-none"
        style={{
          left: '-2%',
          bottom: '-5%',
          width: '104%',
          height: 'clamp(160px, 22vh, 260px)',
        }}
      >
        <img
          src="/assets/music-club/scene-03-minigame/scene3_crowd.png"
          alt="Concert Audience Crowd Foreground"
          className="w-full h-full object-cover object-top opacity-70"
          loading="lazy"
        />
      </div>

      {/* LAYER 10: Subtle Bottom Floor Glow Haze (z-index 21, opacity 0.35) */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[21] pointer-events-none mix-blend-screen opacity-30"
        style={{ height: 'clamp(80px, 12vh, 140px)' }}
      >
        <img
          src="/assets/music-club/scene-03-minigame/scene3_foreground.png"
          alt="Scene 3 Foreground Glow Haze"
          className="w-full h-full object-cover object-bottom"
          loading="lazy"
        />
      </div>

      {/* LAYER 11: Dark Atmospheric Bottom Fade (Smooth transition into Scene 4, z-index 25) */}
      <div
        className="absolute left-0 right-0 bottom-0 pointer-events-none z-[25]"
        style={{
          height: '22vh',
          background:
            'linear-gradient(to bottom, rgba(4, 12, 28, 0) 0%, rgba(4, 12, 28, 0.45) 45%, rgba(3, 9, 20, 0.95) 100%)',
        }}
      />

      {/* Interactive Quiz Player Modal */}
      <MusicQuiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onOpenRegister={onOpenRegister}
      />
    </section>
  )
}
