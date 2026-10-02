import React, { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, Loader2, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react'
import { loginAdmin, AdminUser } from '../../lib/adminApi'

interface AdminLoginPageProps {
  onLoginSuccess: (user: AdminUser) => void
  onNavigateHome: () => void
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ email và mật khẩu.')
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const result = await loginAdmin(email.trim(), password)
      if (result.success && result.user) {
        onLoginSuccess(result.user)
      } else {
        setErrorMessage(result.error || 'Thông tin đăng nhập không chính xác.')
      }
    } catch {
      setErrorMessage('Lỗi kết nối đến máy chủ. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050D1A] text-[#F4F7FB] flex flex-col justify-between selection:bg-[#398BFF] selection:text-white relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#398BFF]/10 via-[#70D7FF]/8 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#398BFF]/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Top Navigation */}
      <div className="px-6 py-6 max-w-6xl mx-auto w-full flex items-center justify-between relative z-10">
        <button
          type="button"
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#91A4BB] hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Về trang chủ HMC</span>
        </button>

        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#70D7FF] shadow-[0_0_8px_#70D7FF]" />
          <span className="text-xs font-mono tracking-[0.24em] text-[#70D7FF] uppercase font-semibold">
            HMC PORTAL
          </span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-[440px] bg-[#09172B]/90 border border-[#78B9F0]/20 rounded-[28px] p-7 sm:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(57,139,255,0.12)] backdrop-blur-xl">
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#0E2A4D] border border-[#70D7FF]/35 flex items-center justify-center text-[#70D7FF] mx-auto shadow-[0_0_20px_rgba(112,215,255,0.25)]">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <h1 className="font-serif-display text-2xl sm:text-3xl text-white tracking-tight pt-1">
              HMC ADMIN
            </h1>

            <p className="text-xs sm:text-sm text-[#91A4BB] leading-relaxed">
              Đăng nhập để quản lý đơn đăng ký casting.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-2xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 flex items-start gap-2.5 text-xs text-[#FF8E8E] animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#FF6B6B]" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email / Username Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold text-[#B8CDE5] uppercase tracking-wider font-mono"
              >
                Email / Username
              </label>
              <div className="relative">
                <input
                  id="admin-email"
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  placeholder="admin@hmcmusic.club"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errorMessage) setErrorMessage('')
                  }}
                  className="w-full h-[50px] pl-11 pr-4 rounded-2xl bg-[#050D1A]/80 border border-[#78B9F0]/20 text-sm text-[#F4F7FB] outline-none transition-all placeholder:text-[#91A4BB]/40 focus:border-[#70D7FF] focus:ring-2 focus:ring-[#398BFF]/20"
                />
                <Mail className="w-4 h-4 text-[#91A4BB] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-[#B8CDE5] uppercase tracking-wider font-mono"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errorMessage) setErrorMessage('')
                  }}
                  className="w-full h-[50px] pl-11 pr-11 rounded-2xl bg-[#050D1A]/80 border border-[#78B9F0]/20 text-sm text-[#F4F7FB] outline-none transition-all placeholder:text-[#91A4BB]/40 focus:border-[#70D7FF] focus:ring-2 focus:ring-[#398BFF]/20"
                />
                <Lock className="w-4 h-4 text-[#91A4BB] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  className="p-2 text-[#91A4BB] hover:text-[#F4F7FB] absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[50px] mt-2 btn-primary-glow rounded-2xl text-sm font-semibold text-white tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(57,139,255,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                <span>ĐĂNG NHẬP</span>
              )}
            </button>
          </form>

          {/* Demo Credentials Helper */}
          <div className="mt-7 pt-5 border-t border-white/10 text-center space-y-1 text-xs text-[#91A4BB]/75">
            <p className="font-mono text-[11px] text-[#70D7FF]/80">Tài khoản mặc định:</p>
            <p className="font-mono text-[11px]">admin@hmcmusic.club / HmcAdmin@2026</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-xs text-[#91A4BB]/60 font-mono">
        HMC MUSIC CLUB RECRUITMENT SYSTEM &copy; 2026
      </div>
    </div>
  )
}
