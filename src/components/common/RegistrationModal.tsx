import React, { useState, useEffect, useRef, useId } from 'react'
import {
  X,
  Sparkles,
  Mic,
  Activity,
  CheckCircle2,
  ArrowRight,
  Loader2,
  AlertCircle,
  ExternalLink,
  Music,
  Heart,
  HelpCircle,
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { sound } from '../../lib/audioSynth'
import { clubData } from '../../data/socialLinks'
import { submitApplication, RecruitmentFormData } from '../../lib/recruitmentService'

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormErrors {
  fullName?: string
  email?: string
  studentId?: string
  castingDivision?: string
  castingSong?: string
  beatUrl?: string
  performanceUrl?: string
  passion?: string
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose }) => {
  const formId = useId()
  const modalRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  // Form State — Preserves data across division switches & experience toggles
  const [formData, setFormData] = useState<RecruitmentFormData>({
    fullName: '',
    email: '',
    studentId: '',
    castingDivision: null,
    castingSong: '',
    beatUrl: '',
    hasPerformanceExperience: false,
    performanceUrl: '',
    passion: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submissionId, setSubmissionId] = useState('')
  const [showConfirmClose, setShowConfirmClose] = useState(false)

  // Check if user has entered significant data
  const isFormDirty = Boolean(
    formData.fullName.trim() ||
      formData.email.trim() ||
      formData.studentId.trim() ||
      formData.castingSong.trim() ||
      formData.beatUrl.trim() ||
      formData.passion.trim().length > 10
  )

  // Body Scroll Lock & Lenis Pause & Escape Key Support
  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Pause Lenis smooth scroll while modal is active
    const lenisInstance = (window as any).__hmc_lenis
    lenisInstance?.stop?.()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleRequestClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // Auto-focus first input on open
    const timer = setTimeout(() => {
      firstInputRef.current?.focus()
    }, 150)

    return () => {
      document.body.style.overflow = originalOverflow
      lenisInstance?.start?.()
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen) return null

  // Validation Logic
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên của bạn.'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Họ và tên quá ngắn.'
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập địa chỉ email.'
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Địa chỉ email chưa đúng định dạng (VD: name@example.com).'
    }

    // Student ID (MSSV) - Normalize & Validate
    const normalizedStudentId = formData.studentId.trim().toUpperCase()
    if (!normalizedStudentId) {
      newErrors.studentId = 'Vui lòng nhập mã số sinh viên.'
    } else if (normalizedStudentId.length < 5) {
      newErrors.studentId = 'Mã số sinh viên chưa đúng định dạng. Ví dụ: 23DHXXXXXX'
    }

    // Casting Division
    if (!formData.castingDivision) {
      newErrors.castingDivision = 'Vui lòng chọn mảng casting (Vocal hoặc Dancer).'
    }

    // Casting Song / Track
    if (!formData.castingSong.trim()) {
      newErrors.castingSong =
        formData.castingDivision === 'vocal'
          ? 'Vui lòng chọn 1 trong 4 bài hát bắt buộc cho phần Vocal Casting.'
          : 'Vui lòng nhập tên bài hát / track bạn chọn cho phần casting.'
    }

    // Beat / Music URL
    const urlRegex = /^https?:\/\/.+/i
    if (!formData.beatUrl.trim()) {
      newErrors.beatUrl =
        formData.castingDivision === 'dancer'
          ? 'Vui lòng cung cấp link nhạc casting (1–3 phút).'
          : 'Vui lòng cung cấp link beat hoặc instrumental (1–3 phút).'
    } else if (!urlRegex.test(formData.beatUrl.trim())) {
      newErrors.beatUrl = 'Link chưa đúng định dạng URL (bắt đầu bằng http:// hoặc https://).'
    }

    // Performance URL is required ONLY when hasPerformanceExperience === true
    if (formData.hasPerformanceExperience === true) {
      if (!formData.performanceUrl?.trim()) {
        newErrors.performanceUrl = 'Vui lòng nhập link một phần trình diễn của bạn.'
      } else if (!urlRegex.test(formData.performanceUrl.trim())) {
        newErrors.performanceUrl = 'Link chưa đúng định dạng URL (bắt đầu bằng http:// hoặc https://).'
      }
    }

    // Passion Textarea (Min 50 characters, Max 800)
    const passionLength = formData.passion.trim().length
    if (!passionLength) {
      newErrors.passion = 'Vui lòng chia sẻ đôi điều về niềm đam mê âm nhạc của bạn.'
    } else if (passionLength < 50) {
      newErrors.passion = `Hãy viết thêm một chút nhé (cần tối thiểu 50 ký tự, hiện tại ${passionLength}/50).`
    } else if (passionLength > 800) {
      newErrors.passion = `Nội dung vượt quá giới hạn 800 ký tự (hiện tại ${passionLength}/800).`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      sound.playFail()
      // Scroll to first error
      const firstErrorEl = modalRef.current?.querySelector('[aria-invalid="true"]')
      firstErrorEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setIsSubmitting(true)
    sound.playClick()

    try {
      const result = await submitApplication(formData)
      if (result.success) {
        sound.playSuccess()
        setSubmissionId(result.id)
        setIsSubmitted(true)

        // Celebration Confetti
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#70D7FF', '#398BFF', '#FFB45C', '#ffffff'],
        })
      }
    } catch (err) {
      console.error('Submission error:', err)
      sound.playFail()
    } finally {
      setIsSubmitting(false)
    }
  }

  // Request Close with Safety Guard
  const handleRequestClose = () => {
    if (isFormDirty && !isSubmitted) {
      setShowConfirmClose(true)
    } else {
      handleForceClose()
    }
  }

  const handleForceClose = () => {
    sound.playClick()
    setShowConfirmClose(false)
    setIsSubmitted(false)
    setErrors({})
    setFormData({
      fullName: '',
      email: '',
      studentId: '',
      castingDivision: null,
      castingSong: '',
      beatUrl: '',
      hasPerformanceExperience: false,
      performanceUrl: '',
      passion: '',
    })
    onClose()
  }

  // Calculate Progress
  const calculateProgress = (): number => {
    let score = 0
    if (formData.fullName && formData.email && formData.studentId) score += 25
    if (formData.castingDivision) score += 25
    if (formData.castingSong && formData.beatUrl) score += 25
    if (formData.passion.trim().length >= 50) score += 25
    return score
  }

  const progressPercent = calculateProgress()

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${formId}-title`}
      data-lenis-prevent="true"
      className="fixed inset-0 z-[999] flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden selection:bg-[#398BFF] selection:text-white"
    >
      {/* 1. Backdrop */}
      <div
        className="fixed inset-0 bg-[#050D1A]/88 backdrop-blur-md transition-opacity duration-300"
        onClick={handleRequestClose}
      />

      {/* 2. Main Modal Window */}
      <div
        ref={modalRef}
        data-lenis-prevent="true"
        className="relative w-full sm:max-w-[1040px] h-[100dvh] sm:h-auto sm:max-h-[90vh] bg-[#050D1A]/96 border border-[#70D7FF]/20 rounded-none sm:rounded-[32px] shadow-[0_25px_80px_rgba(0,0,0,0.92),0_0_40px_rgba(57,139,255,0.18)] text-[#F4F7FB] z-10 flex flex-col overflow-hidden my-0 sm:my-auto transition-all duration-300"
        style={{
          backgroundImage:
            'radial-gradient(circle at 80% 10%, rgba(57, 139, 255, 0.08) 0%, transparent 60%), radial-gradient(circle at 10% 90%, rgba(112, 215, 255, 0.06) 0%, transparent 50%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="shrink-0 flex items-center justify-between px-6 sm:px-10 py-4 bg-[#050D1A]/95 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#70D7FF] shadow-[0_0_8px_#70D7FF]" />
            <span className="text-xs font-mono tracking-[0.28em] text-[#70D7FF] uppercase font-semibold">
              HMC RECRUITMENT 2026
            </span>
          </div>

          <button
            type="button"
            onClick={handleRequestClose}
            aria-label="Đóng biểu mẫu"
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#91A4BB] hover:text-[#F4F7FB] border border-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#071A33] h-1 shrink-0 relative">
          <div
            className="h-full bg-gradient-to-r from-[#398BFF] via-[#70D7FF] to-[#398BFF] transition-all duration-300 shadow-[0_0_10px_#70D7FF]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Modal Body */}
        <div
          data-lenis-prevent="true"
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 sm:px-10 py-6 sm:py-8 custom-scrollbar"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {isSubmitted ? (
            /* SUCCESS STATE */
            <div className="text-center py-10 sm:py-16 max-w-xl mx-auto flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-full bg-[#70D7FF]/15 border border-[#70D7FF]/50 flex items-center justify-center text-[#70D7FF] shadow-[0_0_30px_rgba(112,215,255,0.4)] mb-6">
                <CheckCircle2 className="w-12 h-12 stroke-[2.2]" />
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#398BFF]/15 border border-[#70D7FF]/30 text-xs font-semibold text-[#70D7FF] tracking-wider uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>MÃ HỒ SƠ: {submissionId}</span>
              </div>

              <h3 className="font-serif-display text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-3">
                ĐƠN ĐĂNG KÝ ĐÃ ĐƯỢC GỬI!
              </h3>

              <p className="font-sans text-sm sm:text-base text-[#91A4BB] leading-relaxed mb-6">
                Cảm ơn <span className="text-[#F4F7FB] font-semibold">{formData.fullName}</span> đã dành thời gian chia sẻ với HMC. Hãy theo dõi email <span className="text-[#70D7FF]">{formData.email}</span> và fanpage để không bỏ lỡ thông tin về buổi casting nhé!
              </p>

              {/* Selected Division Chip */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#0E2A4D]/80 border border-[#70D7FF]/30 text-xs font-semibold text-white mb-8">
                {formData.castingDivision === 'vocal' ? (
                  <>
                    <Mic className="w-4 h-4 text-[#70D7FF]" />
                    <span>MẢNG CASTING: VOCAL CASTING</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-4 h-4 text-[#70D7FF]" />
                    <span>MẢNG CASTING: DANCER CASTING</span>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                <button
                  type="button"
                  onClick={handleForceClose}
                  className="w-full sm:w-auto btn-primary-glow px-8 py-3.5 rounded-full text-sm font-semibold text-white tracking-wide cursor-pointer"
                >
                  Quay lại trang chủ
                </button>

                <a
                  href={clubData.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#071A33]/80 hover:bg-[#0E2A4D] border border-[#70D7FF]/25 text-sm font-semibold text-[#91A4BB] hover:text-white transition-all cursor-pointer"
                >
                  <span>Theo dõi HMC Fanpage</span>
                  <ExternalLink className="w-4 h-4 text-[#70D7FF]" />
                </a>
              </div>
            </div>
          ) : (
            /* FORM STATE */
            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              {/* Form Title Heading */}
              <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-9">
                <h2
                  id={`${formId}-title`}
                  className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-[40px] text-white tracking-tight leading-[1.15] mb-3.5"
                >
                  <span>TRỞ THÀNH MỘT PHẦN </span>
                  <br className="hidden sm:block" />
                  <span>CỦA </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#70D7FF] via-[#398BFF] to-[#70D7FF] glow-text-cyan">
                    HMC
                  </span>
                </h2>
                <p className="font-sans text-sm sm:text-base text-[#91A4BB] leading-relaxed">
                  Chọn vị trí bạn muốn casting và chia sẻ một chút về bản thân với chúng mình nhé.
                </p>
                <p className="text-xs text-[#70D7FF]/80 italic mt-1.5 flex items-center justify-center gap-1.5">
                  <Music className="w-3.5 h-3.5 inline" />
                  "Hãy chuẩn bị phần trình diễn mà bạn tự tin nhất."
                </p>

                {/* Casting Status Chip — Persistent visual confirmation directly below main form title */}
                {formData.castingDivision && (
                  <div className="mt-4 sm:mt-4.5 flex justify-center">
                    <div
                      key={`status-chip-${formData.castingDivision}`}
                      className="animate-chip-fade select-none"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 13px',
                        borderRadius: '999px',
                        background: 'rgba(70, 140, 255, 0.10)',
                        border: '1px solid rgba(110, 195, 255, 0.22)',
                        color: '#BFE8FF',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    >
                      {formData.castingDivision === 'vocal' ? (
                        <>
                          <Mic className="w-4 h-4 text-[#70D7FF] shrink-0" />
                          <span>Đang đăng ký: Vocal Casting</span>
                        </>
                      ) : (
                        <>
                          <Activity className="w-4 h-4 text-[#70D7FF] shrink-0" />
                          <span>Đang đăng ký: Dancer Casting</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ---------------------------------------------------- */}
              {/* SECTION 01 — THÔNG TIN CỦA BẠN */}
              {/* ---------------------------------------------------- */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                  <span className="text-xs font-mono font-bold text-[#70D7FF] px-2 py-0.5 rounded bg-[#398BFF]/15 border border-[#70D7FF]/30">
                    01
                  </span>
                  <h3 className="text-sm font-semibold tracking-wider text-white uppercase font-sans">
                    Thông tin của bạn
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
                  {/* Họ và tên */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor={`${formId}-name`}
                      className="block text-xs sm:text-sm font-medium text-[#B8CDE5]"
                    >
                      Họ và tên <span className="text-[#70D7FF] font-bold">*</span>
                    </label>
                    <input
                      ref={firstInputRef}
                      id={`${formId}-name`}
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value })
                        if (errors.fullName) setErrors({ ...errors, fullName: undefined })
                      }}
                      aria-invalid={Boolean(errors.fullName)}
                      className={`w-full h-[48px] sm:h-[52px] px-4 rounded-xl sm:rounded-2xl bg-[#0C1D3A]/72 border text-base sm:text-sm text-[#F4F7FB] outline-none transition-all placeholder:text-[#91A4BB]/45 ${
                        errors.fullName
                          ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20'
                          : 'border-[#78B9F0]/15 focus:border-[#64C3FF]/70 focus:ring-2 focus:ring-[#3C9BFF]/10'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-[#FF6B6B] flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor={`${formId}-email`}
                      className="block text-xs sm:text-sm font-medium text-[#B8CDE5]"
                    >
                      Email <span className="text-[#70D7FF] font-bold">*</span>
                    </label>
                    <input
                      id={`${formId}-email`}
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value })
                        if (errors.email) setErrors({ ...errors, email: undefined })
                      }}
                      aria-invalid={Boolean(errors.email)}
                      className={`w-full h-[48px] sm:h-[52px] px-4 rounded-xl sm:rounded-2xl bg-[#0C1D3A]/72 border text-base sm:text-sm text-[#F4F7FB] outline-none transition-all placeholder:text-[#91A4BB]/45 ${
                        errors.email
                          ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20'
                          : 'border-[#78B9F0]/15 focus:border-[#64C3FF]/70 focus:ring-2 focus:ring-[#3C9BFF]/10'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-[#FF6B6B] flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Mã số sinh viên */}
                  <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                    <label
                      htmlFor={`${formId}-studentId`}
                      className="block text-xs sm:text-sm font-medium text-[#B8CDE5]"
                    >
                      Mã số sinh viên <span className="text-[#70D7FF] font-bold">*</span>
                    </label>
                    <input
                      id={`${formId}-studentId`}
                      type="text"
                      required
                      placeholder="23DHXXXXXX"
                      value={formData.studentId}
                      onChange={(e) => {
                        // Normalize to uppercase
                        const val = e.target.value.toUpperCase()
                        setFormData({ ...formData, studentId: val })
                        if (errors.studentId) setErrors({ ...errors, studentId: undefined })
                      }}
                      aria-invalid={Boolean(errors.studentId)}
                      className={`w-full h-[48px] sm:h-[52px] px-4 rounded-xl sm:rounded-2xl bg-[#0C1D3A]/72 border text-base sm:text-sm text-[#F4F7FB] font-mono tracking-wider outline-none transition-all placeholder:text-[#91A4BB]/45 uppercase ${
                        errors.studentId
                          ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20'
                          : 'border-[#78B9F0]/15 focus:border-[#64C3FF]/70 focus:ring-2 focus:ring-[#3C9BFF]/10'
                      }`}
                    />
                    <div className="flex items-center justify-between text-xs text-[#91A4BB]/70 mt-1">
                      <span>Ví dụ: 23DHXXXXXX</span>
                    </div>
                    {errors.studentId && (
                      <p className="text-xs text-[#FF6B6B] flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.studentId}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* SECTION 02 — MẢNG CASTING */}
              {/* ---------------------------------------------------- */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                  <span className="text-xs font-mono font-bold text-[#70D7FF] px-2 py-0.5 rounded bg-[#398BFF]/15 border border-[#70D7FF]/30">
                    02
                  </span>
                  <h3 className="text-sm font-semibold tracking-wider text-white uppercase font-sans">
                    Mảng casting <span className="text-[#70D7FF]">*</span>
                  </h3>
                </div>

                <div
                  role="radiogroup"
                  aria-label="Chọn mảng casting"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {/* Option 1: VOCAL */}
                  <div
                    role="radio"
                    aria-checked={formData.castingDivision === 'vocal'}
                    tabIndex={0}
                    onClick={() => {
                      sound.playClick()
                      // Preserves all user input, only switches division
                      setFormData((prev) => ({ ...prev, castingDivision: 'vocal' }))
                      if (errors.castingDivision) setErrors((prev) => ({ ...prev, castingDivision: undefined }))
                    }}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault()
                        sound.playClick()
                        setFormData((prev) => ({ ...prev, castingDivision: 'vocal' }))
                      }
                    }}
                    className={`relative p-5 rounded-[24px] cursor-pointer transition-all duration-250 border flex items-start gap-4 select-none ${
                      formData.castingDivision === 'vocal'
                        ? 'bg-[#0E2A4D]/90 border-[#70D7FF] shadow-[0_0_24px_rgba(112,215,255,0.25)] ring-1 ring-[#70D7FF]'
                        : 'bg-[#0A1A33]/70 border-[#70D7FF]/15 hover:border-[#70D7FF]/40 hover:bg-[#0E2A4D]/50'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-200 ${
                        formData.castingDivision === 'vocal'
                          ? 'bg-[#398BFF] border-[#70D7FF] text-white shadow-[0_0_15px_#398BFF]'
                          : 'bg-[#0C1D3A] border-[#70D7FF]/20 text-[#70D7FF]'
                      }`}
                    >
                      <Mic className="w-6 h-6" />
                    </div>

                    <div className="flex-1 pr-6">
                      <div className="flex items-center gap-2">
                        <span className="font-serif-display text-xl font-bold text-white tracking-wide">
                          VOCAL
                        </span>
                        {formData.castingDivision === 'vocal' && (
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#70D7FF]/20 text-[#70D7FF] border border-[#70D7FF]/35 font-semibold">
                            VOCAL CASTING
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-[#91A4BB] leading-relaxed mt-1">
                        Thể hiện màu giọng, cảm xúc và phong cách âm nhạc của bạn.
                      </p>
                    </div>

                    {/* Radio Check Indicator */}
                    <div
                      className={`absolute top-5 right-5 w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        formData.castingDivision === 'vocal'
                          ? 'border-[#70D7FF] bg-[#70D7FF] shadow-[0_0_10px_#70D7FF]'
                          : 'border-white/30 bg-transparent'
                      }`}
                    >
                      {formData.castingDivision === 'vocal' && (
                        <span className="w-2 h-2 rounded-full bg-[#050D1A]" />
                      )}
                    </div>
                  </div>

                  {/* Option 2: DANCER */}
                  <div
                    role="radio"
                    aria-checked={formData.castingDivision === 'dancer'}
                    tabIndex={0}
                    onClick={() => {
                      sound.playClick()
                      // Preserves all user input, only switches division
                      setFormData((prev) => ({ ...prev, castingDivision: 'dancer' }))
                      if (errors.castingDivision) setErrors((prev) => ({ ...prev, castingDivision: undefined }))
                    }}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault()
                        sound.playClick()
                        setFormData((prev) => ({ ...prev, castingDivision: 'dancer' }))
                      }
                    }}
                    className={`relative p-5 rounded-[24px] cursor-pointer transition-all duration-250 border flex items-start gap-4 select-none ${
                      formData.castingDivision === 'dancer'
                        ? 'bg-[#0E2A4D]/90 border-[#70D7FF] shadow-[0_0_24px_rgba(112,215,255,0.25)] ring-1 ring-[#70D7FF]'
                        : 'bg-[#0A1A33]/70 border-[#70D7FF]/15 hover:border-[#70D7FF]/40 hover:bg-[#0E2A4D]/50'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-200 ${
                        formData.castingDivision === 'dancer'
                          ? 'bg-[#398BFF] border-[#70D7FF] text-white shadow-[0_0_15px_#398BFF]'
                          : 'bg-[#0C1D3A] border-[#70D7FF]/20 text-[#70D7FF]'
                      }`}
                    >
                      <Activity className="w-6 h-6" />
                    </div>

                    <div className="flex-1 pr-6">
                      <div className="flex items-center gap-2">
                        <span className="font-serif-display text-xl font-bold text-white tracking-wide">
                          DANCER
                        </span>
                        {formData.castingDivision === 'dancer' && (
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#70D7FF]/20 text-[#70D7FF] border border-[#70D7FF]/35 font-semibold">
                            DANCER CASTING
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-[#91A4BB] leading-relaxed mt-1">
                        Thể hiện kỹ thuật, năng lượng và khả năng làm chủ sân khấu.
                      </p>
                    </div>

                    {/* Radio Check Indicator */}
                    <div
                      className={`absolute top-5 right-5 w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        formData.castingDivision === 'dancer'
                          ? 'border-[#70D7FF] bg-[#70D7FF] shadow-[0_0_10px_#70D7FF]'
                          : 'border-white/30 bg-transparent'
                      }`}
                    >
                      {formData.castingDivision === 'dancer' && (
                        <span className="w-2 h-2 rounded-full bg-[#050D1A]" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* SECTION 03 — DYNAMIC CASTING SECTION */}
              {/* ---------------------------------------------------- */}
              <div className="space-y-4 pt-2">
                {/* 1. Dynamic Section Header Title */}
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                  <span className="text-xs font-mono font-bold text-[#70D7FF] px-2 py-0.5 rounded bg-[#398BFF]/15 border border-[#70D7FF]/30">
                    03
                  </span>
                  <h3
                    key={`title-${formData.castingDivision}`}
                    className="text-sm font-semibold tracking-wider text-white uppercase font-sans animate-division-change"
                  >
                    {formData.castingDivision === 'vocal' ? 'VOCAL CASTING' : 'DANCER CASTING'}
                  </h3>
                </div>

                {/* 2. Dynamic Section Helper / Intro Text */}
                <p
                  key={`intro-${formData.castingDivision}`}
                  className="text-xs sm:text-sm text-[#91A4BB] leading-relaxed animate-division-change"
                >
                  {formData.castingDivision === 'vocal'
                    ? 'Hãy chuẩn bị một phần trình bày thể hiện màu giọng, cảm xúc và phong cách âm nhạc của bạn.'
                    : 'Hãy chuẩn bị một phần trình diễn thể hiện kỹ thuật, năng lượng và khả năng làm chủ sân khấu của bạn.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-1">
                  {/* 3. Song / Track Field: Vocal (4 Mandatory Songs) vs Dancer (Free-text Track) */}
                  {formData.castingDivision === 'vocal' ? (
                    <div className="space-y-3 sm:col-span-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <label className="block text-sm font-medium text-[#B8CDE5]">
                          Chọn 1 trong 4 bài hát bắt buộc khi đi casting <span className="text-[#70D7FF] font-bold">*</span>
                        </label>
                        <span className="text-xs text-[#70D7FF]/80 italic">
                          (2 bài giọng nam & 2 bài giọng nữ)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {/* Nhóm Giọng Nam */}
                        <div className="p-3.5 rounded-2xl bg-[#08172E]/80 border border-[#78B9F0]/15 space-y-2.5 shadow-inner">
                          <div className="flex items-center gap-2 text-xs font-semibold text-[#70D7FF] uppercase tracking-wider font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#70D7FF] shadow-[0_0_6px_#70D7FF]" />
                            <span>Giọng Nam</span>
                          </div>

                          <div className="space-y-2">
                            {[
                              { id: 'song-nam-1', title: 'Linh thiêng Việt Nam' },
                              { id: 'song-nam-2', title: 'Khát vọng tuổi trẻ' },
                            ].map((song) => {
                              const isSelected = formData.castingSong === song.title
                              return (
                                <div
                                  key={song.id}
                                  role="radio"
                                  aria-checked={isSelected}
                                  tabIndex={0}
                                  onClick={() => {
                                    sound.playClick()
                                    setFormData((prev) => ({ ...prev, castingSong: song.title }))
                                    if (errors.castingSong) {
                                      setErrors((prev) => ({ ...prev, castingSong: undefined }))
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === ' ' || e.key === 'Enter') {
                                      e.preventDefault()
                                      sound.playClick()
                                      setFormData((prev) => ({ ...prev, castingSong: song.title }))
                                      if (errors.castingSong) {
                                        setErrors((prev) => ({ ...prev, castingSong: undefined }))
                                      }
                                    }
                                  }}
                                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm transition-all duration-200 cursor-pointer select-none ${
                                    isSelected
                                      ? 'bg-[#0E2A4D] border-[#70D7FF] text-white shadow-[0_0_15px_rgba(112,215,255,0.25)] ring-1 ring-[#70D7FF]'
                                      : 'bg-[#0C1D3A]/60 border-white/10 text-[#B8CDE5] hover:border-[#70D7FF]/40 hover:bg-[#0E2A4D]/50 hover:text-white'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <Music className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#70D7FF]' : 'text-[#91A4BB]'}`} />
                                    <span className="font-medium">{song.title}</span>
                                  </div>

                                  <div
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                                      isSelected
                                        ? 'border-[#70D7FF] bg-[#70D7FF] shadow-[0_0_8px_#70D7FF]'
                                        : 'border-white/30 bg-transparent'
                                    }`}
                                  >
                                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#050D1A]" />}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Nhóm Giọng Nữ */}
                        <div className="p-3.5 rounded-2xl bg-[#08172E]/80 border border-[#78B9F0]/15 space-y-2.5 shadow-inner">
                          <div className="flex items-center gap-2 text-xs font-semibold text-[#FFB45C] uppercase tracking-wider font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB45C] shadow-[0_0_6px_#FFB45C]" />
                            <span>Giọng Nữ</span>
                          </div>

                          <div className="space-y-2">
                            {[
                              { id: 'song-nu-1', title: 'Tàu anh qua núi' },
                              { id: 'song-nu-2', title: 'Đất phương Nam' },
                            ].map((song) => {
                              const isSelected = formData.castingSong === song.title
                              return (
                                <div
                                  key={song.id}
                                  role="radio"
                                  aria-checked={isSelected}
                                  tabIndex={0}
                                  onClick={() => {
                                    sound.playClick()
                                    setFormData((prev) => ({ ...prev, castingSong: song.title }))
                                    if (errors.castingSong) {
                                      setErrors((prev) => ({ ...prev, castingSong: undefined }))
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === ' ' || e.key === 'Enter') {
                                      e.preventDefault()
                                      sound.playClick()
                                      setFormData((prev) => ({ ...prev, castingSong: song.title }))
                                      if (errors.castingSong) {
                                        setErrors((prev) => ({ ...prev, castingSong: undefined }))
                                      }
                                    }
                                  }}
                                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm transition-all duration-200 cursor-pointer select-none ${
                                    isSelected
                                      ? 'bg-[#0E2A4D] border-[#70D7FF] text-white shadow-[0_0_15px_rgba(112,215,255,0.25)] ring-1 ring-[#70D7FF]'
                                      : 'bg-[#0C1D3A]/60 border-white/10 text-[#B8CDE5] hover:border-[#70D7FF]/40 hover:bg-[#0E2A4D]/50 hover:text-white'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <Music className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#FFB45C]' : 'text-[#91A4BB]'}`} />
                                    <span className="font-medium">{song.title}</span>
                                  </div>

                                  <div
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                                      isSelected
                                        ? 'border-[#70D7FF] bg-[#70D7FF] shadow-[0_0_8px_#70D7FF]'
                                        : 'border-white/30 bg-transparent'
                                    }`}
                                  >
                                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#050D1A]" />}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>

                      {errors.castingSong && (
                        <p className="text-xs text-[#FF6B6B] flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.castingSong}</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    /* DANCER / DEFAULT: Free-text Track Field */
                    <div className="space-y-1.5">
                      <label
                        htmlFor={`${formId}-song`}
                        className="block text-sm font-medium text-[#B8CDE5]"
                      >
                        Bài hát / track bạn chọn khi đi casting? <span className="text-[#70D7FF] font-bold">*</span>
                      </label>
                      <input
                        id={`${formId}-song`}
                        type="text"
                        required
                        placeholder="Ví dụ: Supernova – aespa"
                        value={formData.castingSong}
                        onChange={(e) => {
                          setFormData({ ...formData, castingSong: e.target.value })
                          if (errors.castingSong) setErrors({ ...errors, castingSong: undefined })
                        }}
                        aria-invalid={Boolean(errors.castingSong)}
                        className={`w-full h-[48px] sm:h-[52px] px-4 rounded-xl sm:rounded-2xl bg-[#0C1D3A]/72 border text-base sm:text-sm text-[#F4F7FB] outline-none transition-all placeholder:text-[#91A4BB]/45 ${
                          errors.castingSong
                            ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20'
                            : 'border-[#78B9F0]/15 focus:border-[#64C3FF]/70 focus:ring-2 focus:ring-[#3C9BFF]/10'
                        }`}
                      />
                      <p
                        key={`song-helper-${formData.castingDivision || 'default'}`}
                        className="text-xs text-[#91A4BB]/70 animate-division-change"
                      >
                        Track bạn sẽ sử dụng cho phần Dancer Casting.
                      </p>
                      {errors.castingSong && (
                        <p className="text-xs text-[#FF6B6B] flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.castingSong}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* 4. Beat / Audio Link Field (Dynamic Wording) */}
                  <div className={`space-y-1.5 ${formData.castingDivision === 'vocal' ? 'sm:col-span-2' : ''}`}>
                    <label
                      htmlFor={`${formId}-beat`}
                      className="block text-sm font-medium text-[#B8CDE5]"
                    >
                      {formData.castingDivision === 'vocal'
                        ? 'Link beat (1–3 phút)'
                        : 'Link nhạc casting (1–3 phút)'}{' '}
                      <span className="text-[#70D7FF] font-bold">*</span>
                    </label>
                    <input
                      id={`${formId}-beat`}
                      type="url"
                      required
                      placeholder="https://drive.google.com/... hoặc YouTube, SoundCloud"
                      value={formData.beatUrl}
                      onChange={(e) => {
                        setFormData({ ...formData, beatUrl: e.target.value })
                        if (errors.beatUrl) setErrors({ ...errors, beatUrl: undefined })
                      }}
                      aria-invalid={Boolean(errors.beatUrl)}
                      className={`w-full h-[48px] sm:h-[52px] px-4 rounded-xl sm:rounded-2xl bg-[#0C1D3A]/72 border text-base sm:text-sm text-[#F4F7FB] outline-none transition-all placeholder:text-[#91A4BB]/45 ${
                        errors.beatUrl
                          ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20'
                          : 'border-[#78B9F0]/15 focus:border-[#64C3FF]/70 focus:ring-2 focus:ring-[#3C9BFF]/10'
                      }`}
                    />
                    <p
                      key={`beat-helper-${formData.castingDivision || 'default'}`}
                      className="text-xs text-[#91A4BB]/70 animate-division-change"
                    >
                      {formData.castingDivision === 'vocal'
                        ? 'Vui lòng gửi beat hoặc instrumental cho bài hát bạn đã chọn.'
                        : 'Vui lòng gửi đoạn nhạc bạn sẽ sử dụng cho phần trình diễn Dancer.'}
                    </p>
                    {errors.beatUrl && (
                      <p className="text-xs text-[#FF6B6B] flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.beatUrl}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* 5. Performance Experience Question & Segmented Control */}
                <div className="space-y-3 pt-2">
                  <label className="block text-sm font-medium text-[#B8CDE5]">
                    Bạn đã từng biểu diễn ở bên ngoài bao giờ chưa?{' '}
                    <span className="text-[#70D7FF] font-bold">*</span>
                  </label>

                  {/* Modern Segmented Control: CÓ / CHƯA */}
                  <div className="inline-flex p-1 rounded-2xl bg-[#08172E] border border-[#78B9F0]/20 gap-1.5 shadow-inner">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick()
                        setFormData((prev) => ({ ...prev, hasPerformanceExperience: true }))
                      }}
                      className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer select-none ${
                        formData.hasPerformanceExperience === true
                          ? 'bg-gradient-to-r from-[#398BFF] to-[#1A64D8] text-white border border-[#70D7FF]/60 shadow-[0_0_18px_rgba(57,139,255,0.6)]'
                          : 'text-[#91A4BB] hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      CÓ
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick()
                        // Preserves existing performanceUrl in state so it can be restored if user switches back to CÓ
                        setFormData((prev) => ({
                          ...prev,
                          hasPerformanceExperience: false,
                        }))
                        if (errors.performanceUrl) {
                          setErrors((prev) => ({ ...prev, performanceUrl: undefined }))
                        }
                      }}
                      className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer select-none ${
                        formData.hasPerformanceExperience === false
                          ? 'bg-gradient-to-r from-[#398BFF] to-[#1A64D8] text-white border border-[#70D7FF]/60 shadow-[0_0_18px_rgba(57,139,255,0.6)]'
                          : 'text-[#91A4BB] hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      CHƯA
                    </button>
                  </div>

                  {/* 6. "CÓ" BEHAVIOR: Smooth Reveal of Performance Link */}
                  {formData.hasPerformanceExperience === true && (
                    <div className="space-y-1.5 pt-2 animate-perf-reveal">
                      <label
                        htmlFor={`${formId}-perfUrl`}
                        className="block text-sm font-medium text-[#B8CDE5]"
                      >
                        Link một phần trình diễn của bạn <span className="text-[#70D7FF] font-bold">*</span>
                      </label>
                      <input
                        id={`${formId}-perfUrl`}
                        type="url"
                        required
                        placeholder="https://youtube.com/... hoặc TikTok, Facebook, Google Drive"
                        value={formData.performanceUrl || ''}
                        onChange={(e) => {
                          setFormData({ ...formData, performanceUrl: e.target.value })
                          if (errors.performanceUrl) setErrors({ ...errors, performanceUrl: undefined })
                        }}
                        aria-invalid={Boolean(errors.performanceUrl)}
                        className={`w-full h-[48px] sm:h-[52px] px-4 rounded-xl sm:rounded-2xl bg-[#0C1D3A]/72 border text-base sm:text-sm text-[#F4F7FB] outline-none transition-all placeholder:text-[#91A4BB]/45 ${
                          errors.performanceUrl
                            ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20'
                            : 'border-[#78B9F0]/15 focus:border-[#64C3FF]/70 focus:ring-2 focus:ring-[#3C9BFF]/10'
                        }`}
                      />
                      <p className="text-xs text-[#91A4BB]/70">
                        Bạn có thể gửi link YouTube, TikTok, Facebook hoặc Google Drive.
                      </p>
                      {errors.performanceUrl && (
                        <p className="text-xs text-[#FF6B6B] flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.performanceUrl}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* 7. "CHƯA" BEHAVIOR: Encouraging Positive Note */}
                  {formData.hasPerformanceExperience === false && (
                    <div className="pt-2 animate-division-change">
                      <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#071A33]/80 border border-[#70D7FF]/20 text-xs sm:text-sm text-[#91A4BB] shadow-[0_2px_12px_rgba(0,0,0,0.25)]">
                        <Heart className="w-4 h-4 text-[#70D7FF] shrink-0" />
                        <span>Không sao nhé — HMC luôn chào đón những bạn muốn thử sức và phát triển cùng CLB.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* SECTION 04 — MỘT CHÚT VỀ BẠN */}
              {/* ---------------------------------------------------- */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                  <span className="text-xs font-mono font-bold text-[#70D7FF] px-2 py-0.5 rounded bg-[#398BFF]/15 border border-[#70D7FF]/30">
                    04
                  </span>
                  <h3 className="text-sm font-semibold tracking-wider text-white uppercase font-sans">
                    Một chút về bạn
                  </h3>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={`${formId}-passion`}
                      className="block text-sm font-medium text-[#B8CDE5]"
                    >
                      Chia sẻ niềm yêu thích âm nhạc của bạn với HMC nhé{' '}
                      <span className="text-[#70D7FF] font-bold">*</span>
                    </label>
                    <span
                      className={`text-xs font-mono ${
                        formData.passion.length >= 50 && formData.passion.length <= 800
                          ? 'text-[#70D7FF]'
                          : formData.passion.length > 800
                          ? 'text-[#FF6B6B] font-bold'
                          : 'text-[#91A4BB]'
                      }`}
                    >
                      {formData.passion.length} / 800
                    </span>
                  </div>

                  {/* Dynamic placeholder personalized for Vocal vs Dancer */}
                  <textarea
                    id={`${formId}-passion`}
                    rows={4}
                    required
                    placeholder={
                      formData.castingDivision === 'vocal'
                        ? 'Bạn yêu thích điều gì ở việc ca hát và âm nhạc? Bạn mong muốn trải nghiệm điều gì khi tham gia HMC?'
                        : 'Điều gì khiến bạn yêu thích nhảy và biểu diễn? Bạn mong muốn trải nghiệm điều gì khi tham gia HMC?'
                    }
                    value={formData.passion}
                    onChange={(e) => {
                      setFormData({ ...formData, passion: e.target.value })
                      if (errors.passion) setErrors({ ...errors, passion: undefined })
                    }}
                    aria-invalid={Boolean(errors.passion)}
                    className={`w-full p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0C1D3A]/72 border text-base sm:text-sm text-[#F4F7FB] outline-none transition-all placeholder:text-[#91A4BB]/45 resize-none leading-relaxed ${
                      errors.passion
                        ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20'
                        : 'border-[#78B9F0]/15 focus:border-[#64C3FF]/70 focus:ring-2 focus:ring-[#3C9BFF]/10'
                    }`}
                  />
                  {errors.passion && (
                    <p className="text-xs text-[#FF6B6B] flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.passion}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* SUBMIT AREA */}
              {/* ---------------------------------------------------- */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-[#91A4BB] flex items-center gap-1.5 text-center sm:text-left">
                  <HelpCircle className="w-3.5 h-3.5 text-[#70D7FF] shrink-0" />
                  <span>Kiểm tra lại thông tin trước khi gửi nhé.</span>
                </p>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleRequestClose}
                    disabled={isSubmitting}
                    className="px-5 py-3.5 rounded-full text-xs sm:text-sm font-semibold text-[#91A4BB] hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                  >
                    Hủy
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-initial btn-primary-glow flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold text-white tracking-wide cursor-pointer shadow-[0_0_25px_rgba(57,139,255,0.6)] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ minHeight: '54px' }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang gửi...</span>
                      </>
                    ) : (
                      <>
                        <span>GỬI ĐƠN ĐĂNG KÝ</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* 3. Close Safety Confirmation Dialog */}
        {showConfirmClose && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#050D1A]/90 backdrop-blur-md animate-in fade-in duration-150">
            <div className="max-w-md w-full p-6 rounded-3xl bg-[#071A33] border border-[#70D7FF]/30 shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FF6B6B]/15 border border-[#FF6B6B]/30 flex items-center justify-center text-[#FF6B6B] mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-serif-display text-xl text-white">
                Bạn chưa gửi đơn đăng ký
              </h4>
              <p className="text-sm text-[#91A4BB] leading-relaxed">
                Thông tin bạn vừa điền sẽ bị mất nếu đóng ngay lúc này. Bạn có chắc chắn muốn đóng không?
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmClose(false)}
                  className="btn-primary-glow px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white"
                >
                  Tiếp tục điền
                </button>
                <button
                  type="button"
                  onClick={handleForceClose}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-xs sm:text-sm font-semibold text-[#FF6B6B] transition-colors cursor-pointer"
                >
                  Đóng form
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

