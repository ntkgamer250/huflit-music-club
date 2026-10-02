import React, { useRef } from 'react'
import { Sparkles } from 'lucide-react'
import { ReferenceOverlay } from '../common/ReferenceOverlay'

interface AboutSceneProps {
  onOpenRegister?: () => void
  showReferenceOverlay?: boolean
}

export const AboutScene: React.FC<AboutSceneProps> = ({ showReferenceOverlay = false }) => {
  const sceneRef = useRef<HTMLElement>(null)

  return (
    <section
      id="about"
      ref={sceneRef}
      className="relative w-full min-h-0 lg:h-screen lg:min-h-[820px] pt-12 sm:pt-16 lg:pt-[18vh] pb-8 lg:pb-0 overflow-visible select-none bg-transparent"
    >
      {/* Reference Overlay (toggled via 'R') */}
      <ReferenceOverlay
        src="/assets/music-club/scene-02-about/reference.png"
        show={showReferenceOverlay}
      />

      {/* LAYER 1: Background - Backstage Environment with Top & Bottom Gradient Masks for Seamless Overlaps */}
      <div
        className="about-bg absolute inset-0 z-0 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.25) 12%, black 35%, black 82%, rgba(0,0,0,0.4) 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.25) 12%, black 35%, black 82%, rgba(0,0,0,0.4) 92%, transparent 100%)',
        }}
      >
        <img
          src="/assets/music-club/scene-02-about/background.png"
          alt="Backstage Studio Background"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050D1A]/85 via-[#050D1A]/45 to-[#050D1A]/80" />
      </div>

      {/* DESKTOP TARGET COMPOSITION (lg screens: 1440x900 target artboard) */}
      <div className="hidden lg:block absolute inset-0 w-full h-full pointer-events-auto">
        {/* TEXT GROUP: left 12.5%, top 20%, width 32% */}
        <div
          className="about-text-group absolute z-20 flex flex-col items-start text-left"
          style={{
            left: '12.5%',
            top: '20%',
            width: '32%',
          }}
        >
          {/* Eyebrow: top ~19% */}
          <div className="about-eyebrow flex items-center gap-3 mb-3">
            <span className="w-8 h-[1px] bg-[#70D7FF]/80" />
            <span className="text-xs tracking-[0.35em] text-[#70D7FF] font-semibold uppercase flex items-center gap-1.5 glow-text-cyan">
              <Sparkles className="w-3.5 h-3.5" />
              MUSIC • COMMUNITY • PASSION
            </span>
          </div>

          {/* Heading: top ~24%, max-width ~440px */}
          <h2
            className="about-heading font-serif-display text-5xl xl:text-6xl text-white tracking-tight leading-[1.06] mb-5"
            style={{ maxWidth: '440px' }}
          >
            <span>WE ARE </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#70D7FF] via-[#398BFF] to-[#70D7FF] glow-text-cyan">
              THE SOUND
            </span>
          </h2>

          {/* Description: top ~47%, max-width ~400px */}
          <p
            className="about-desc font-sans text-sm xl:text-base text-[#91A4BB] leading-relaxed"
            style={{ maxWidth: '400px' }}
          >
            CLB Âm nhạc là nơi những người trẻ yêu âm nhạc gặp gỡ, học hỏi và cùng nhau tạo nên những sân khấu đáng nhớ. Từ những buổi tập nhỏ đến những sự kiện lớn, mỗi thành viên đều góp một nhịp điệu riêng vào câu chuyện chung.
          </p>
        </div>

        {/* PHOTO & SOUNDWAVE WEAVING COLLAGE (Single Integrated 3D Depth Group) */}
        <div
          className="photo-cluster scene2-collage absolute z-[5] pointer-events-auto"
          style={{
            left: '45%',
            top: '14%',
            width: '50%',
            height: '72%',
          }}
        >
          {/* 1. WAVE-BACK: Behind all photos (z-index: 3, opacity: 0.32, soft ambient glow) */}
          <div
            className="wave wave-back absolute pointer-events-none mix-blend-screen"
            style={{
              left: '-6%',
              top: '-8%',
              width: '112%',
              height: '112%',
              zIndex: 3,
              opacity: 0.32,
            }}
          >
            <img
              src="/assets/music-club/scene-02-about/soundwave_main.png"
              alt="Soundwave Back Layer"
              className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(112,215,255,0.4)]"
              loading="lazy"
            />
          </div>

          {/* 2. PHOTO 01: Top photo - Live Theatrical Stage Performance (z-index: 5) */}
          <div
            className="photo photo-1 about-photo-1 about-photo-slot-1 absolute transition-transform duration-300 hover:scale-[1.02] hover:z-30 cursor-pointer"
            style={{
              left: '19%',
              top: '0%',
              width: '67%',
              transform: 'rotate(-1deg)',
              zIndex: 5,
            }}
          >
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_20px_rgba(57,139,255,0.2)] border border-[#70D7FF]/30 aspect-[3/2]">
              <img
                src="/assets/music-club/scene-02-about/club_stage_performance.jpg"
                alt="Tiết mục biểu diễn nghệ thuật trên sân khấu"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>

          {/* 3. WAVE-MID: In the gap between Photo 01 and Photo 02/03 (z-index: 6, opacity: 0.42) */}
          <div
            className="wave wave-mid absolute pointer-events-none mix-blend-screen"
            style={{
              left: '8%',
              top: '20%',
              width: '88%',
              height: '70%',
              zIndex: 6,
              opacity: 0.42,
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 70%, 0% 70%)',
            }}
          >
            <img
              src="/assets/music-club/scene-02-about/soundwave_main.png"
              alt="Soundwave Mid Layer"
              className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(112,215,255,0.5)]"
              loading="lazy"
            />
          </div>

          {/* 4. PHOTO 02: Far Left photo - Giải Vàng CLB Âm Nhạc (z-index: 7) */}
          <div
            className="photo photo-2 about-photo-2 about-photo-slot-2 absolute transition-transform duration-300 hover:scale-[1.02] hover:z-30 cursor-pointer"
            style={{
              left: '1%',
              top: '42%',
              width: '52%',
              transform: 'rotate(-2deg)',
              zIndex: 7,
            }}
          >
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(112,215,255,0.25)] border border-[#70D7FF]/35 aspect-[3/2]">
              <img
                src="/assets/music-club/scene-02-about/club_award_gold.jpg"
                alt="Lễ trao giải - Giải Vàng Câu lạc bộ Âm nhạc"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>

          {/* 5. PHOTO 03: Bottom photo - Youth Fest 2026 Live Performance (z-index: 8) */}
          <div
            className="photo photo-3 about-photo-3 about-photo-slot-3 absolute transition-transform duration-300 hover:scale-[1.02] hover:z-30 cursor-pointer"
            style={{
              left: '48%',
              top: '50%',
              width: '50%',
              transform: 'rotate(2deg)',
              zIndex: 8,
            }}
          >
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(57,139,255,0.25)] border border-[#70D7FF]/35 aspect-[3/2]">
              <img
                src="/assets/music-club/scene-02-about/club_youth_fest.jpg"
                alt="Tiết mục biểu diễn tại Youth Fest 2026"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>

          {/* 6. WAVE-FRONT: Only a short visible segment in front of Photo 03 */}
          <div
            className="wave wave-front absolute pointer-events-none mix-blend-screen"
            style={{
              left: '36%',
              top: '46%',
              width: '66%',
              height: '60%',
              zIndex: 9,
              opacity: 0.55,
              clipPath: 'polygon(35% 25%, 100% 20%, 100% 100%, 25% 100%)',
            }}
          >
            <img
              src="/assets/music-club/scene-02-about/soundwave_main.png"
              alt="Soundwave Front Segment"
              className="w-full h-full object-contain filter drop-shadow-[0_0_15px_#70D7FF]"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* MOBILE / TABLET RESPONSIVE FALLBACK (< lg) */}
      <div className="lg:hidden relative z-20 max-w-xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-6 h-[1px] bg-[#70D7FF]" />
          <span className="text-[11px] tracking-[0.25em] text-[#70D7FF] font-semibold uppercase">
            MUSIC • COMMUNITY
          </span>
          <span className="w-6 h-[1px] bg-[#70D7FF]" />
        </div>

        <h2 className="font-serif-display text-3xl sm:text-4xl text-white mb-3 tracking-tight">
          WE ARE <span className="text-[#70D7FF]">THE SOUND</span>
        </h2>

        <p className="font-sans text-sm text-[#91A4BB] leading-relaxed mb-6 max-w-md">
          CLB Âm nhạc là nơi những người trẻ yêu âm nhạc gặp gỡ, học hỏi và cùng nhau tạo nên những sân khấu đáng nhớ.
        </p>

        {/* Stacked overlapping photo cluster for mobile */}
        <div className="relative w-full max-w-sm aspect-[4/3] my-4">
          <div className="absolute top-0 right-2 w-[68%] rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.85)] border border-[#70D7FF]/35 -rotate-2 z-10 aspect-[3/2]">
            <img
              src="/assets/music-club/scene-02-about/club_stage_performance.jpg"
              alt="Biểu diễn sân khấu"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute bottom-2 left-2 w-[62%] rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.9)] border border-[#70D7FF]/40 rotate-2 z-20 aspect-[3/2]">
            <img
              src="/assets/music-club/scene-02-about/club_award_gold.jpg"
              alt="Lễ trao giải Giải Vàng"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute bottom-0 right-4 w-[56%] rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.9)] border border-[#70D7FF]/40 -rotate-1 z-30 aspect-[3/2]">
            <img
              src="/assets/music-club/scene-02-about/club_youth_fest.jpg"
              alt="Youth Fest 2026"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
