import React, { useRef } from 'react'
import { Sparkles, Mic, Zap, Calendar, MapPin, ArrowRight } from 'lucide-react'
import { sound } from '../../lib/audioSynth'

interface FamilySceneProps {
  onOpenRegister?: () => void
}

export const FamilyScene: React.FC<FamilySceneProps> = ({ onOpenRegister }) => {
  const sceneRef = useRef<HTMLElement>(null)

  const handleRegisterClick = () => {
    sound.playHover()
    if (onOpenRegister) {
      onOpenRegister()
    }
  }

  return (
    <section
      id="family"
      ref={sceneRef}
      className="relative w-full min-h-screen lg:min-h-[108vh] lg:h-auto py-24 lg:py-32 overflow-visible select-none bg-transparent"
    >
      {/* LAYER 1: Deep Blue Concert Stage / Backstage Continuity Background */}
      <div
        className="family-bg absolute inset-0 z-0 pointer-events-none"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 6%, black 18%, black 85%, rgba(0,0,0,0.3) 95%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 6%, black 18%, black 85%, rgba(0,0,0,0.3) 95%, transparent 100%)',
        }}
      >
        <img
          src="/assets/music-club/scene-02-about/background.png"
          alt="Backstage Studio Atmosphere"
          className="w-full h-full object-cover object-bottom"
          style={{ filter: 'brightness(0.65) contrast(1.15) saturate(1.15)' }}
          loading="lazy"
        />
        {/* Deep Blue Gradients for Visual Consistency */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050D1A]/75 via-[#050D1A]/40 to-[#050D1A]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050D1A]/85 via-transparent to-[#050D1A]/85" />
      </div>

      {/* LAYER 2: Text Readability Gradient Overlay (LEFT SIDE ONLY - No hard card/box edges) */}
      <div
        className="absolute inset-y-0 left-0 w-full lg:w-[60%] z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(3, 10, 24, 0.88) 0%, rgba(3, 10, 24, 0.62) 48%, rgba(3, 10, 24, 0) 85%)',
        }}
      />

      {/* LAYER 3: Ambient Stage Lights & Smoke Glow */}
      <div className="family-ambient absolute inset-0 z-[2] pointer-events-none opacity-30 mix-blend-screen">
        <div className="absolute top-[20%] left-[8%] w-[450px] h-[450px] rounded-full bg-[#1A3E6D]/30 blur-[110px]" />
        <div className="absolute top-[48%] right-[10%] w-[480px] h-[480px] rounded-full bg-[#0E2A4D]/40 blur-[100px]" />
      </div>

      {/* LAYER 4: Subtle Background Soundwave (Passes behind left text & behind photos, opacity ~0.24) */}
      <div
        className="family-wave absolute pointer-events-none mix-blend-screen z-[3]"
        style={{
          left: '2%',
          top: '22%',
          width: '75%',
          height: '65%',
          opacity: 0.24,
        }}
      >
        <img
          src="/assets/music-club/scene-02-about/soundwave_main.png"
          alt="Soundwave Energy Line"
          className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(112,215,255,0.3)]"
          loading="lazy"
        />
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP 2-COLUMN EDITORIAL COMPOSITION (lg screens)                       */}
      {/* ========================================================================= */}
      <div className="hidden lg:block relative z-[10] w-full max-w-[1520px] mx-auto px-[6vw] xl:px-[8vw]">
        <div className="grid grid-cols-12 gap-8 xl:gap-12 items-start">
          {/* ===================================================================== */}
          {/* LEFT COLUMN: Pure Editorial Typography Directly On Scene Background  */}
          {/* (NO Card, NO Box, NO Glass Panel, NO Border)                         */}
          {/* ===================================================================== */}
          <div className="casting-guide-left col-span-6 xl:col-span-6 flex flex-col text-left pr-4 pt-2">
            {/* 1. EYEBROW */}
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-[1px] bg-[#70D7FF]/80" />
              <span className="text-xs tracking-[0.32em] text-[#70D7FF] font-semibold uppercase flex items-center gap-1.5 glow-text-cyan">
                <Sparkles className="w-3.5 h-3.5" />
                CASTING GUIDE
              </span>
            </div>

            {/* 2. HEADING (2 Lines, Left Aligned, serif clamp(46px, 4vw, 68px)) */}
            <h2
              className="font-serif-display text-white tracking-tight leading-[1.02] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] mb-3"
              style={{ fontSize: 'clamp(46px, 3.8vw, 64px)' }}
            >
              <span className="block text-white">HƯỚNG DẪN</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#70D7FF] via-[#398BFF] to-[#70D7FF] glow-text-cyan">
                THAM GIA CASTING
              </span>
            </h2>

            {/* 3. SUBTITLE */}
            <p className="font-sans text-[16px] xl:text-[17px] text-[#91A4BB] max-w-[490px] leading-relaxed mb-7">
              Hãy chuẩn bị thật tốt để tự tin tỏa sáng cùng HMC.
            </p>

            {/* 4. VOCAL SECTION (Sitting directly on background) */}
            <div className="casting-vocal-block flex flex-col mb-5">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#3C96FF]/15 border border-[#70D7FF]/30 flex items-center justify-center text-[#70D7FF] shadow-[0_0_10px_rgba(112,215,255,0.2)]">
                  <Mic className="w-4 h-4" />
                </div>
                <h3 className="font-serif-display text-[23px] xl:text-[25px] font-bold text-white tracking-wide">
                  VOCAL
                </h3>
                <span className="text-[11px] font-semibold text-[#70D7FF] uppercase tracking-[0.2em] bg-[#70D7FF]/10 px-2.5 py-0.5 rounded-full border border-[#70D7FF]/20 ml-1">
                  VOCAL CASTING
                </span>
              </div>

              <ul className="space-y-2 text-[15px] xl:text-[16px] text-[#E2E8F0] pl-1 mb-2">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#70D7FF] mt-2 shrink-0 shadow-[0_0_6px_#70D7FF]" />
                  <span>Một bài hát cá nhân (1–3 phút) mà bạn tự tin nhất</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#70D7FF] mt-2 shrink-0 shadow-[0_0_6px_#70D7FF]" />
                  <span>Một bài hát bắt buộc khi tham gia casting</span>
                </li>
              </ul>

              <p className="text-[14px] text-[#91A4BB] italic pl-4 border-l border-[#70D7FF]/30 mt-1 opacity-80">
                "Hãy ưu tiên phần trình bày thể hiện rõ màu giọng và cảm xúc của bạn."
              </p>
            </div>

            {/* 5. SUBTLE DIVIDER 1 */}
            <div
              className="my-5 h-[1px] w-[82%]"
              style={{ background: 'rgba(120, 190, 255, 0.14)' }}
            />

            {/* 6. DANCER SECTION (Sitting directly on background) */}
            <div className="casting-dancer-block flex flex-col mb-5">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#3C96FF]/15 border border-[#70D7FF]/30 flex items-center justify-center text-[#70D7FF] shadow-[0_0_10px_rgba(112,215,255,0.2)]">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-serif-display text-[23px] xl:text-[25px] font-bold text-white tracking-wide">
                  DANCER
                </h3>
                <span className="text-[11px] font-semibold text-[#70D7FF] uppercase tracking-[0.2em] bg-[#70D7FF]/10 px-2.5 py-0.5 rounded-full border border-[#70D7FF]/20 ml-1">
                  DANCER CASTING
                </span>
              </div>

              <ul className="space-y-2 text-[15px] xl:text-[16px] text-[#E2E8F0] pl-1 mb-2">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#70D7FF] mt-2 shrink-0 shadow-[0_0_6px_#70D7FF]" />
                  <span>Chuẩn bị một bài nhảy 1–3 phút</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#70D7FF] mt-2 shrink-0 shadow-[0_0_6px_#70D7FF]" />
                  <span>Yêu cầu chuẩn bị chỉnh chu khi tham gia casting</span>
                </li>
              </ul>

              <p className="text-[14px] text-[#91A4BB] italic pl-4 border-l border-[#70D7FF]/30 mt-1 opacity-80">
                "Hãy lựa chọn phần biểu diễn giúp bạn thể hiện kỹ thuật, thần thái và năng lượng sân khấu."
              </p>
            </div>

            {/* 7. SUBTLE DIVIDER 2 */}
            <div
              className="my-5 h-[1px] w-[82%]"
              style={{ background: 'rgba(120, 190, 255, 0.14)' }}
            />

            {/* 8. CASTING INFO (Clean 2-Row Editorial Layout) */}
            <div className="casting-meta-block grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[520px] mb-7">
              {/* Row/Col 1: NGÀY GIỜ CASTING */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#3C96FF]/10 border border-[#70D7FF]/20 flex items-center justify-center text-[#70D7FF] shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-[#70D7FF] uppercase tracking-[0.2em] mb-0.5">
                    NGÀY GIỜ CASTING
                  </span>
                  <span className="text-[15px] font-medium text-white">
                    Sẽ cập nhật
                  </span>
                </div>
              </div>

              {/* Row/Col 2: ĐỊA ĐIỂM */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#3C96FF]/10 border border-[#70D7FF]/20 flex items-center justify-center text-[#70D7FF] shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-[#70D7FF] uppercase tracking-[0.2em] mb-0.5">
                    ĐỊA ĐIỂM
                  </span>
                  <span className="text-[14px] text-[#B0C4DE] leading-snug">
                    Phòng hội thảo lầu 1,<br />828 Sư Vạn Hạnh, Hòa Hưng, HCM.
                  </span>
                </div>
              </div>
            </div>

            {/* 9. CTA BUTTON */}
            <div>
              <button
                type="button"
                onClick={handleRegisterClick}
                className="btn-primary-glow inline-flex items-center justify-center gap-2.5 px-8 rounded-full text-[15px] font-semibold text-white tracking-wide cursor-pointer shadow-[0_0_25px_rgba(57,139,255,0.6)] hover:scale-105 active:scale-95 transition-all"
                style={{ height: '54px' }}
              >
                <span>Đăng ký CTV</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* RIGHT COLUMN: Two Large Real HMC Photos (Cinematic Overlapping Depth) */}
          {/* ===================================================================== */}
          <div className="col-span-6 xl:col-span-6 relative h-[680px] xl:h-[720px] pointer-events-auto">
            {/* PHOTO 01 (Dominant Upper-Right: Live Concert Stage Team) */}
            <div
              className="casting-photo-1-wrap absolute cursor-pointer group transition-transform duration-500"
              style={{
                right: '4%',
                top: '6%',
                width: '90%',
                maxWidth: '520px',
                zIndex: 6,
              }}
            >
              <div
                className="casting-photo-1 transition-transform duration-300 group-hover:scale-[1.02]"
                style={{ transform: 'rotate(-1.5deg)' }}
              >
                <div className="rounded-[24px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.88),0_0_25px_rgba(57,139,255,0.22)] border border-[#70D7FF]/30 aspect-[3/2] bg-[#0A1A2F]">
                  <img
                    src="/assets/music-club/scene-02-about/club_concert_team.jpg"
                    alt="Đại gia đình CLB Âm nhạc trên sân khấu rực rỡ"
                    className="w-full h-full object-cover object-center group-hover:brightness-105 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* PHOTO 02 (Secondary Lower-Right / Slightly Left-Overlapping: Jamming & Friendship) */}
            <div
              className="casting-photo-2-wrap absolute cursor-pointer group transition-transform duration-500"
              style={{
                right: '12%',
                top: '46%',
                width: '82%',
                maxWidth: '460px',
                zIndex: 8,
              }}
            >
              <div
                className="casting-photo-2 transition-transform duration-300 group-hover:scale-[1.02]"
                style={{ transform: 'rotate(2deg)' }}
              >
                <div className="rounded-[22px] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.94),0_0_30px_rgba(112,215,255,0.25)] border border-[#70D7FF]/35 aspect-[3/2] bg-[#0A1A2F]">
                  <img
                    src="/assets/music-club/scene-02-about/club_family_jamming.jpg"
                    alt="Khoảnh khắc tập luyện và gắn kết của thành viên CLB"
                    className="w-full h-full object-cover object-center group-hover:brightness-105 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE & TABLET EDITORIAL COMPOSITION (< lg screens)                      */}
      {/* ========================================================================= */}
      <div className="lg:hidden relative z-[10] max-w-xl mx-auto px-5 py-8 flex flex-col text-left">
        {/* Eyebrow */}
        <div className="flex items-center gap-2.5 mb-2.5">
          <span className="w-6 h-[1px] bg-[#70D7FF]" />
          <span className="text-xs tracking-[0.25em] text-[#70D7FF] font-semibold uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            CASTING GUIDE
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-serif-display text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-2">
          <span>HƯỚNG DẪN </span>
          <span className="text-[#70D7FF]">THAM GIA CASTING</span>
        </h2>

        <p className="font-sans text-sm text-[#91A4BB] mb-6">
          Hãy chuẩn bị thật tốt để tự tin tỏa sáng cùng HMC.
        </p>

        {/* Vocal */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Mic className="w-4 h-4 text-[#70D7FF]" />
            <h3 className="font-serif-display text-lg font-bold text-white">VOCAL</h3>
            <span className="text-[10px] text-[#70D7FF] uppercase tracking-wider bg-[#70D7FF]/10 px-2 py-0.5 rounded-full border border-[#70D7FF]/20">
              VOCAL CASTING
            </span>
          </div>
          <ul className="space-y-1.5 text-sm text-[#E2E8F0] pl-2 mb-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#70D7FF] mt-1.5 shrink-0" />
              <span>Một bài hát cá nhân (1–3 phút) mà bạn tự tin nhất</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#70D7FF] mt-1.5 shrink-0" />
              <span>Một bài hát bắt buộc khi tham gia casting</span>
            </li>
          </ul>
          <p className="text-xs text-[#91A4BB] italic pl-3 border-l border-[#70D7FF]/30 opacity-80">
            "Hãy ưu tiên phần trình bày thể hiện rõ màu giọng và cảm xúc của bạn."
          </p>
        </div>

        <div className="my-4 h-[1px] w-full bg-[#70D7FF]/15" />

        {/* Dancer */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-[#70D7FF]" />
            <h3 className="font-serif-display text-lg font-bold text-white">DANCER</h3>
            <span className="text-[10px] text-[#70D7FF] uppercase tracking-wider bg-[#70D7FF]/10 px-2 py-0.5 rounded-full border border-[#70D7FF]/20">
              DANCER CASTING
            </span>
          </div>
          <ul className="space-y-1.5 text-sm text-[#E2E8F0] pl-2 mb-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#70D7FF] mt-1.5 shrink-0" />
              <span>Chuẩn bị một bài nhảy 1–3 phút</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#70D7FF] mt-1.5 shrink-0" />
              <span>Yêu cầu chuẩn bị chỉnh chu khi tham gia casting</span>
            </li>
          </ul>
          <p className="text-xs text-[#91A4BB] italic pl-3 border-l border-[#70D7FF]/30 opacity-80">
            "Hãy lựa chọn phần biểu diễn giúp bạn thể hiện kỹ thuật, thần thái và năng lượng sân khấu."
          </p>
        </div>

        <div className="my-4 h-[1px] w-full bg-[#70D7FF]/15" />

        {/* Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-[#70D7FF] shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-[#70D7FF]">NGÀY GIỜ CASTING</div>
              <div className="text-sm text-white">Sẽ cập nhật</div>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#70D7FF] shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-[#70D7FF]">ĐỊA ĐIỂM</div>
              <div className="text-xs text-[#B0C4DE]">Phòng hội thảo lầu 1, 828 Sư Vạn Hạnh, Hòa Hưng, HCM.</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mb-8">
          <button
            type="button"
            onClick={handleRegisterClick}
            className="btn-primary-glow w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold text-white tracking-wide"
          >
            <span>Đăng ký CTV</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Photos Stack */}
        <div className="w-full space-y-4">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-[#70D7FF]/30 -rotate-1 aspect-[3/2]">
            <img
              src="/assets/music-club/scene-02-about/club_concert_team.jpg"
              alt="HMC Concert"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-[#70D7FF]/30 rotate-1 aspect-[3/2]">
            <img
              src="/assets/music-club/scene-02-about/club_family_jamming.jpg"
              alt="HMC Jamming"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
