import { useState, useEffect, useRef } from 'react'
import { Navbar } from './components/navigation/Navbar'
import { HeroScene } from './components/scenes/HeroScene'
import { AboutScene } from './components/scenes/AboutScene'
import { FamilyScene } from './components/scenes/FamilyScene'
import { MiniGameScene } from './components/scenes/MiniGameScene'
import { ContactScene } from './components/scenes/ContactScene'
import { SoundWaveLayer } from './components/effects/SoundWaveLayer'
import { PaperPlaneTransition } from './components/effects/PaperPlaneTransition'
import { RegistrationModal } from './components/common/RegistrationModal'
import { AdminLoginPage } from './components/admin/AdminLoginPage'
import { AdminApplicationsPage } from './components/admin/AdminApplicationsPage'
import { checkAuth, AdminUser } from './lib/adminApi'
import { useLenis } from './hooks/useLenis'
import { useReducedMotion } from './hooks/useReducedMotion'
import { gsap, ScrollTrigger } from './lib/gsap'
import { Loader2 } from 'lucide-react'

export function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname)
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [isAuthChecking, setIsAuthChecking] = useState(true)

  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [showReferenceOverlay, setShowReferenceOverlay] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const appRef = useRef<HTMLDivElement>(null)

  const isAdminRoute = currentPath.startsWith('/admin')

  // Navigation Helper
  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
    window.scrollTo(0, 0)
  }

  // Popstate Listener
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Verify Admin Auth Status on mount
  useEffect(() => {
    const verifyAuth = async () => {
      setIsAuthChecking(true)
      try {
        const res = await checkAuth()
        if (res.authenticated && res.user) {
          setCurrentUser(res.user)
        } else {
          setCurrentUser(null)
        }
      } catch {
        setCurrentUser(null)
      } finally {
        setIsAuthChecking(false)
      }
    }
    verifyAuth()
  }, [currentPath])

  // Initialize Lenis smooth scroll if on public website and reduced motion is disabled
  useLenis(!prefersReducedMotion && !isAdminRoute)

  // Keyboard shortcut 'R' to toggle design reference overlay during development
  useEffect(() => {
    if (isAdminRoute) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement
      const isInput = activeEl && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeEl.tagName)
      if ((e.key === 'r' || e.key === 'R') && !isInput) {
        setShowReferenceOverlay((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAdminRoute])

  // GSAP Animations: 100% Reversible, Cinematic Scroll-Linked Scrub System (Public website only)
  useEffect(() => {
    if (prefersReducedMotion || isAdminRoute) return

    const ctx = gsap.context(() => {
      // ==========================================
      // 1. HERO LOAD ENTRANCE (Initial page reveal)
      // ==========================================
      const heroLoadTl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      heroLoadTl
        .fromTo(
          '.navbar-container',
          { opacity: 0, y: -15 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.1 }
        )
        .fromTo(
          '.hero-eyebrow',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          '.hero-heading',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9 },
          '-=0.6'
        )
        .fromTo(
          '.hero-desc',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          '.hero-buttons',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          '.hero-mic',
          { scale: 0.96, opacity: 0.7 },
          { scale: 1, opacity: 1, duration: 1.1, ease: 'power2.out' },
          '-=0.7'
        )
        .fromTo(
          '.hero-soundwave',
          { opacity: 0.3 },
          { opacity: 1, duration: 1.2 },
          '-=0.9'
        )

      // ==========================================
      // 2. HERO SCROLL EXIT (100% Reversible Scrub)
      // ==========================================
      // Hero Content fades out & moves up gently on scroll down, restores on scroll up
      gsap.fromTo(
        '.hero-content',
        { autoAlpha: 1, y: 0 },
        {
          autoAlpha: 0,
          y: -55,
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: '55% top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Microphone: Stays visible longer, subtle upward motion & scale
      gsap.fromTo(
        '.hero-mic',
        { y: 0, scale: 1, opacity: 1 },
        {
          y: -30,
          scale: 0.97,
          opacity: 0.82,
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: '75% top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Soundwave: Follows transition toward About scene
      gsap.fromTo(
        '.hero-soundwave',
        { y: 0, scale: 1, opacity: 1 },
        {
          y: 15,
          scale: 1.04,
          opacity: 0.85,
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: '80% top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Hero Smoke: Moves slightly upward during exit
      gsap.fromTo(
        '.hero-smoke',
        { y: 0 },
        {
          y: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: '80% top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Hero Falling Particles: Fades gracefully into transition, 100% reversible
      gsap.fromTo(
        '.hero-particles',
        { opacity: 1, y: 0 },
        {
          opacity: 0,
          y: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: '75% top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // ==========================================
      // 3. ABOUT SCENE ENTRY & REVEAL (Reversible)
      // ==========================================
      // About Background gradual blend in
      gsap.fromTo(
        '.about-bg',
        { opacity: 0.6 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 85%',
            end: 'top 40%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // About Heading: Reveal from left
      gsap.fromTo(
        '.about-heading',
        { autoAlpha: 0, x: -30 },
        {
          autoAlpha: 1,
          x: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 80%',
            end: 'top 50%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // About Description: Reveal from bottom
      gsap.fromTo(
        '.about-desc',
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 75%',
            end: 'top 45%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Photo 01 Entry: Top photo (Stage Performance)
      gsap.fromTo(
        '.about-photo-1',
        { y: 35, scale: 0.98, autoAlpha: 0.4 },
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 85%',
            end: 'top 55%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Photo 02 Entry: Far Left photo (Giai Vang)
      gsap.fromTo(
        '.about-photo-2',
        { y: 50, scale: 0.98, autoAlpha: 0.4 },
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 80%',
            end: 'top 50%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Photo 03 Entry: Bottom photo (Youth Fest)
      gsap.fromTo(
        '.about-photo-3',
        { y: 30, scale: 0.98, autoAlpha: 0.4 },
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 75%',
            end: 'top 45%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // ==========================================
      // 4. ABOUT PHOTO PARALLAX & SOUNDWAVE WEAVE
      // ==========================================
      // Subtle depth parallax while scrolling through About scene
      gsap.to('.about-photo-1', {
        y: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: '#about',
          start: 'top 50%',
          end: 'bottom 50%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.about-photo-2', {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: '#about',
          start: 'top 50%',
          end: 'bottom 50%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.about-photo-3', {
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: '#about',
          start: 'top 50%',
          end: 'bottom 50%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      // 3D Weaving Soundwave light motion
      gsap.fromTo(
        '.wave-back',
        { y: 15, x: -5 },
        {
          y: -10,
          x: 5,
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 80%',
            end: 'bottom 50%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      gsap.fromTo(
        '.wave-mid',
        { y: 10, x: 5 },
        {
          y: -15,
          x: -5,
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 80%',
            end: 'bottom 50%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      gsap.fromTo(
        '.wave-front',
        { y: 8, x: -3 },
        {
          y: -10,
          x: 3,
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 80%',
            end: 'bottom 50%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // About exit transition toward WE ARE FAMILY (last ~15-18vh of About)
      gsap.to('.about-heading, .about-desc', {
        opacity: 0.35,
        y: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: '#about',
          start: 'bottom 50%',
          end: 'bottom 15%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.about-photo-1, .about-photo-2, .about-photo-3', {
        y: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: '#about',
          start: 'bottom 50%',
          end: 'bottom 15%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      // ==========================================
      // 4B. WE ARE FAMILY SCENE ENTRY & REVEAL (100% Reversible)
      // ==========================================
      // Family Background gradual blend in
      gsap.fromTo(
        '.family-bg',
        { opacity: 0.5 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#family',
            start: 'top 85%',
            end: 'top 40%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Title & Left Typography Reveal: x -24px -> 0, opacity 0 -> 1
      gsap.fromTo(
        '.casting-guide-left',
        { autoAlpha: 0, x: -24 },
        {
          autoAlpha: 1,
          x: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#family',
            start: 'top 80%',
            end: 'top 45%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Photo 1 Entry (Dominant Upper-Right): y 24px -> 0, opacity 0 -> 1
      gsap.fromTo(
        '.casting-photo-1-wrap',
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#family',
            start: 'top 80%',
            end: 'top 45%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Photo 2 Entry (Secondary Lower-Right): y 36px -> 0, opacity 0 -> 1
      gsap.fromTo(
        '.casting-photo-2-wrap',
        { autoAlpha: 0, y: 36 },
        {
          autoAlpha: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#family',
            start: 'top 75%',
            end: 'top 40%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // ==========================================
      // 4C. CASTING PHOTO PARALLAX & SOUNDWAVE
      // ==========================================
      // Parallax while scrolling across Casting scene
      gsap.to('.casting-photo-1-wrap', {
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: '#family',
          start: 'top 45%',
          end: 'bottom 45%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.casting-photo-2-wrap', {
        y: -35,
        ease: 'none',
        scrollTrigger: {
          trigger: '#family',
          start: 'top 45%',
          end: 'bottom 45%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      // Weaving Soundwave light motion through Casting scene
      gsap.fromTo(
        '.family-wave',
        { y: 10, opacity: 0.18 },
        {
          y: -12,
          opacity: 0.28,
          ease: 'none',
          scrollTrigger: {
            trigger: '#family',
            start: 'top 80%',
            end: 'bottom 50%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // CASTING -> MINI GAME EXIT TRANSITION (last 18-20vh)
      gsap.to('.casting-photo-1-wrap', {
        y: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: '#family',
          start: 'bottom 40%',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.casting-photo-2-wrap', {
        y: -24,
        ease: 'none',
        scrollTrigger: {
          trigger: '#family',
          start: 'bottom 40%',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.casting-guide-left', {
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: {
          trigger: '#family',
          start: 'bottom 35%',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.family-wave', {
        opacity: 0.45,
        ease: 'none',
        scrollTrigger: {
          trigger: '#family',
          start: 'bottom 35%',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      // ==========================================
      // 5. MINI GAME ENTRY & PARALLAX
      // ==========================================
      // Atmosphere build-up
      gsap.fromTo(
        '.minigame-bg',
        { opacity: 0.45 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#minigame',
            start: 'top 85%',
            end: 'top 45%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      gsap.fromTo(
        '.minigame-lights',
        { opacity: 0.25 },
        {
          opacity: 0.62,
          ease: 'none',
          scrollTrigger: {
            trigger: '#minigame',
            start: 'top 85%',
            end: 'top 45%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      gsap.fromTo(
        '.minigame-smoke',
        { opacity: 0.25 },
        {
          opacity: 0.58,
          ease: 'none',
          scrollTrigger: {
            trigger: '#minigame',
            start: 'top 85%',
            end: 'top 45%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Title Reveal
      gsap.fromTo(
        '.minigame-title-group',
        { autoAlpha: 0, y: 25 },
        {
          autoAlpha: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#minigame',
            start: 'top 80%',
            end: 'top 50%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Vinyl Disc Reveal & Scale
      gsap.fromTo(
        '.minigame-vinyl',
        { opacity: 0.25, scale: 0.94 },
        {
          opacity: 0.60,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#minigame',
            start: 'top 85%',
            end: 'top 45%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Orbital Soundwave
      gsap.fromTo(
        '.minigame-soundwave',
        { opacity: 0.30, scale: 0.98 },
        {
          opacity: 0.65,
          scale: 1.02,
          ease: 'none',
          scrollTrigger: {
            trigger: '#minigame',
            start: 'top 80%',
            end: 'top 40%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Audience Crowd Foreground: Parallax from y: 25px -> -10px
      gsap.fromTo(
        '.minigame-crowd',
        { y: 25 },
        {
          y: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: '#minigame',
            start: 'top 85%',
            end: 'bottom 20%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Mini Game Exit -> Contact Transition (final 15-18vh)
      gsap.to('.minigame-crowd', {
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: '#minigame',
          start: 'bottom 35%',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.minigame-lights', {
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: {
          trigger: '#minigame',
          start: 'bottom 35%',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      // ==========================================
      // SCENE 3 -> SCENE 4 PAPER PLANE TRANSITION (Single Center Plane)
      // ==========================================
      const planeCenter = document.querySelector('.plane-center')

      if (planeCenter) {
        const planesTl = gsap.timeline({
          scrollTrigger: {
            trigger: '#minigame',
            start: 'bottom 75%',
            end: 'bottom 10%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        })

        // Initial setup
        gsap.set(planeCenter, {
          x: '-14vw',
          y: '32vh',
          rotation: -8,
          autoAlpha: 0,
        })

        // SINGLE CENTER PLANE — Smooth, elegant flight path across transition
        planesTl
          .to(
            planeCenter,
            {
              autoAlpha: 1,
              duration: 0.1,
              ease: 'none',
            },
            0.0
          )
          .to(
            planeCenter,
            {
              x: '28vw',
              y: '28vh',
              rotation: -2,
              duration: 0.32,
              ease: 'none',
            },
            0.05
          )
          .to(
            planeCenter,
            {
              x: '62vw',
              y: '22vh',
              rotation: 6,
              duration: 0.35,
              ease: 'none',
            },
            0.37
          )
          .to(
            planeCenter,
            {
              x: '114vw',
              y: '14vh',
              rotation: 14,
              autoAlpha: 0,
              duration: 0.28,
              ease: 'none',
            },
            0.72
          )
      }

      // ==========================================
      // 6. CONTACT SCENE ENTRY (Calm Studio Mood)
      // ==========================================
      // Contact Background
      gsap.fromTo(
        '.contact-bg',
        { opacity: 0.4 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#contact',
            start: 'top 90%',
            end: 'top 40%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Warm Desk Lamp
      gsap.fromTo(
        '.contact-lamp',
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#contact',
            start: 'top 80%',
            end: 'top 35%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Smoke in Studio
      gsap.fromTo(
        '.contact-smoke',
        { opacity: 0 },
        {
          opacity: 0.5,
          ease: 'none',
          scrollTrigger: {
            trigger: '#contact',
            start: 'top 80%',
            end: 'top 40%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Heading Reveal: From Left
      gsap.fromTo(
        '.contact-heading-group',
        { autoAlpha: 0, x: -25 },
        {
          autoAlpha: 1,
          x: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#contact',
            start: 'top 75%',
            end: 'top 45%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Contact Details Reveal: From Bottom
      gsap.fromTo(
        '.contact-info',
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#contact',
            start: 'top 70%',
            end: 'top 40%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Contact Form: From Right
      gsap.fromTo(
        '.contact-form',
        { autoAlpha: 0, x: 30 },
        {
          autoAlpha: 1,
          x: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#contact',
            start: 'top 70%',
            end: 'top 40%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // Studio Desk & Props Parallax
      gsap.fromTo(
        '.contact-desk',
        { y: 15 },
        {
          y: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: '#contact',
            start: 'top 75%',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )
    }, appRef)

    // Ensure ScrollTrigger accurately calculates positions after fonts load
    if (document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh()
      })
    }

    return () => ctx.revert()
  }, [prefersReducedMotion])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // 1. ADMIN ROUTING BRANCH
  if (isAdminRoute) {
    if (isAuthChecking) {
      return (
        <div className="min-h-screen bg-[#050D1A] flex items-center justify-center text-[#70D7FF]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-xs font-mono tracking-widest uppercase">Đang xác thực hệ thống...</span>
          </div>
        </div>
      )
    }

    if (currentPath === '/admin/login') {
      if (currentUser) {
        return (
          <AdminApplicationsPage
            currentUser={currentUser}
            onLogout={() => {
              setCurrentUser(null)
              navigate('/admin/login')
            }}
            onNavigateHome={() => navigate('/')}
          />
        )
      }
      return (
        <AdminLoginPage
          onLoginSuccess={(user) => {
            setCurrentUser(user)
            navigate('/admin/applications')
          }}
          onNavigateHome={() => navigate('/')}
        />
      )
    }

    // Any other /admin route (e.g. /admin/applications, /admin)
    if (!currentUser) {
      return (
        <AdminLoginPage
          onLoginSuccess={(user) => {
            setCurrentUser(user)
            navigate('/admin/applications')
          }}
          onNavigateHome={() => navigate('/')}
        />
      )
    }

    return (
      <AdminApplicationsPage
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null)
          navigate('/admin/login')
        }}
        onNavigateHome={() => navigate('/')}
      />
    )
  }

  // 2. PUBLIC WEBSITE BRANCH
  return (
    <div ref={appRef} className="min-h-screen bg-[#050D1A] text-[#F4F7FB] relative selection:bg-[#398BFF] selection:text-white overflow-x-hidden">
      {/* Global SoundWave Narrative Ribbon */}
      <SoundWaveLayer />

      {/* Scene 3 -> Scene 4 Easter-Egg Paper Plane Scroll Transition */}
      <PaperPlaneTransition />

      {/* Global Navigation Bar */}
      <Navbar onOpenRegister={() => setIsRegisterOpen(true)} />

      {/* Reference Overlay Status Indicator (Dev helper) */}
      <button
        type="button"
        onClick={() => setShowReferenceOverlay((prev) => !prev)}
        className="fixed bottom-4 right-4 z-[99999] px-3.5 py-1.5 rounded-full text-[11px] font-mono font-medium backdrop-blur-md border transition-all cursor-pointer shadow-lg select-none flex items-center gap-2"
        style={{
          backgroundColor: showReferenceOverlay ? 'rgba(57, 139, 255, 0.85)' : 'rgba(7, 26, 51, 0.7)',
          borderColor: showReferenceOverlay ? '#70D7FF' : 'rgba(112, 215, 255, 0.25)',
          color: showReferenceOverlay ? '#FFFFFF' : '#91A4BB',
        }}
        title="Nhấn 'R' trên bàn phím để bật/tắt Reference Overlay"
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: showReferenceOverlay ? '#70D7FF' : '#91A4BB' }}
        />
        <span>Overlay [R]: {showReferenceOverlay ? 'ON' : 'OFF'}</span>
      </button>

      {/* Main Continuous Musical World with Seamless Overlaps */}
      <main className="music-world relative w-full overflow-hidden">
        {/* SCENE 01: HERO (Concert Stage) */}
        <div className="relative z-[2]">
          <HeroScene
            onOpenRegister={() => setIsRegisterOpen(true)}
            onExplore={() => scrollToSection('about')}
            showReferenceOverlay={showReferenceOverlay}
          />
        </div>

        {/* SCENE 02: ABOUT (Club Overview / Backstage - Overlaps Hero ~18vh) */}
        <div className="-mt-[18vh] relative z-[3]">
          <AboutScene
            showReferenceOverlay={showReferenceOverlay}
          />
        </div>

        {/* SCENE 02B: WE ARE FAMILY (Club Memories & Friendship - Overlaps About ~18vh) */}
        <div className="-mt-[18vh] relative z-[4]">
          <FamilyScene
            onOpenRegister={() => setIsRegisterOpen(true)}
          />
        </div>

        {/* SCENE 03: MINI GAME (Music Challenge & Vinyl Arena - Clean Independent Section) */}
        <div className="relative z-[5]">
          <MiniGameScene
            onOpenRegister={() => setIsRegisterOpen(true)}
            showReferenceOverlay={showReferenceOverlay}
          />
        </div>

        {/* SCENE 04: CONTACT (Late Night Music Studio - Clean Independent Section) */}
        <div className="relative z-[6]">
          <ContactScene
            showReferenceOverlay={showReferenceOverlay}
          />
        </div>
      </main>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </div>
  )
}
export default App
