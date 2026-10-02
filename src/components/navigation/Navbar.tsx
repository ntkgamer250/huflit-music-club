import React, { useState, useEffect } from 'react'
import { sound } from '../../lib/audioSynth'
import { Volume2, VolumeX, Menu, X, ArrowRight } from 'lucide-react'
import { navItems } from '../../data/socialLinks'

interface NavbarProps {
  onOpenRegister: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRegister }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)

      // Determine active section
      const sections = ['hero', 'about', 'family', 'minigame', 'contact']
      const scrollPos = window.scrollY + 250

      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleSound = () => {
    const muted = sound.toggleMute()
    setIsMuted(muted)
    if (!muted) {
      sound.playSuccess()
    }
  }

  const handleNavClick = (href: string) => {
    sound.playClick()
    setMobileMenuOpen(false)
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`navbar-container fixed top-0 left-0 right-0 z-50 py-3.5 sm:py-4 transition-colors duration-300 ${
        isScrolled
          ? 'bg-[#050D1A]/85 backdrop-blur-md border-b border-[#70D7FF]/15 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-[#050D1A]/45 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault()
            handleNavClick('#hero')
          }}
          className="flex items-center gap-3 group cursor-pointer"
        >
          {/* Glowing Waveform Logo Icon */}
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#0E2A4D]/80 border border-[#70D7FF]/30 group-hover:border-[#70D7FF] group-hover:shadow-[0_0_15px_rgba(112,215,255,0.4)] transition-all">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-[#70D7FF] fill-none stroke-current stroke-2 group-hover:scale-110 transition-transform"
            >
              <path d="M2 12h2l2-5 3 10 3-8 3 6 2-3h5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-serif-display text-lg tracking-wider text-[#F4F7FB] font-semibold group-hover:text-[#70D7FF] transition-colors leading-none">
              MUSIC CLUB
            </span>
            <span className="text-[10px] tracking-[0.25em] text-[#91A4BB] uppercase font-mono mt-0.5">
              EST. 2020
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#071A33]/70 backdrop-blur-lg border border-[#70D7FF]/20 shadow-[0_0_20px_rgba(5,13,26,0.6)]">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.replace('#', '')
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(item.href)
                }}
                onMouseEnter={() => sound.playHover()}
                className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? 'text-[#70D7FF] bg-[#0E2A4D]/90 shadow-[0_0_12px_rgba(112,215,255,0.25)]'
                    : 'text-[#91A4BB] hover:text-[#F4F7FB] hover:bg-white/5'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-[2px] bg-[#70D7FF] rounded-full shadow-[0_0_6px_#70D7FF]" />
                )}
              </a>
            )
          })}
        </nav>

        {/* Right Action Area */}
        <div className="hidden md:flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            title={isMuted ? 'Bật âm thanh hiệu ứng' : 'Tắt âm thanh hiệu ứng'}
            className="p-2.5 rounded-full bg-[#071A33]/70 border border-[#70D7FF]/20 text-[#91A4BB] hover:text-[#70D7FF] hover:border-[#70D7FF]/50 transition-all cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#70D7FF]" />}
          </button>

          {/* Primary CTA */}
          <button
            type="button"
            onClick={() => {
              sound.playClick()
              onOpenRegister()
            }}
            onMouseEnter={() => sound.playHover()}
            className="btn-primary-glow flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white tracking-wide cursor-pointer"
          >
            <span>Đăng ký CTV</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 rounded-lg bg-[#071A33]/70 border border-[#70D7FF]/20 text-[#91A4BB]"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#70D7FF]" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#071A33]/70 border border-[#70D7FF]/20 text-[#F4F7FB]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-4 p-4 rounded-2xl bg-[#071A33]/95 backdrop-blur-xl border border-[#70D7FF]/30 shadow-2xl animate-in fade-in duration-200">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(item.href)
                }}
                className="px-4 py-2.5 rounded-xl text-base font-medium text-[#F4F7FB] hover:text-[#70D7FF] hover:bg-[#0E2A4D]/60 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 mt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  onOpenRegister()
                }}
                className="w-full btn-primary-glow flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white"
              >
                <span>Đăng ký CTV</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
