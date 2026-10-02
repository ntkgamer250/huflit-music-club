import React, { useState, useEffect, useRef } from 'react'
import {
  Search,
  Download,
  RotateCcw,
  Mic,
  Activity,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  ThumbsDown,
  Sparkles,
  ExternalLink,
  Eye,
  SlidersHorizontal,
  LogOut,
  Users,
  Flame,
  Music,
  User,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import {
  ApplicationItem,
  ApplicationCounts,
  CastingStatus,
  fetchApplications,
  logoutAdmin,
  AdminUser,
  exportClientCsv,
} from '../../lib/adminApi'
import { ApplicantDetailDrawer } from './ApplicantDetailDrawer'

interface AdminApplicationsPageProps {
  currentUser: AdminUser
  onLogout: () => void
  onNavigateHome: () => void
}

export const AdminApplicationsPage: React.FC<AdminApplicationsPageProps> = ({
  currentUser,
  onLogout,
  onNavigateHome,
}) => {
  // State
  const [applications, setApplications] = useState<ApplicationItem[]>([])
  const [counts, setCounts] = useState<ApplicationCounts>({
    total: 0,
    vocal: 0,
    dancer: 0,
    new: 0,
    reviewing: 0,
    shortlisted: 0,
    rejected: 0,
    accepted: 0,
  })
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [divisionFilter, setDivisionFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [experienceFilter, setExperienceFilter] = useState('all')
  const [sortOption, setSortOption] = useState('newest')

  // Selected Detail Drawer
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Debounce search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
      setCurrentPage(1) // Reset to page 1 on new search
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch applications
  const loadData = async () => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const data = await fetchApplications({
        q: debouncedQuery,
        division: divisionFilter,
        status: statusFilter,
        experience: experienceFilter,
        sort: sortOption,
        page: currentPage,
        limit: 20,
      })

      setApplications(data.applications)
      setTotalCount(data.total)
      setTotalPages(data.totalPages)
      setCounts(data.counts)
    } catch (err: any) {
      if (err.message === 'UNAUTHORIZED') {
        onLogout()
        return
      }
      setErrorMessage(err.message || 'Không thể tải danh sách đăng ký.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [debouncedQuery, divisionFilter, statusFilter, experienceFilter, sortOption, currentPage])

  const handleResetFilters = () => {
    setSearchQuery('')
    setDebouncedQuery('')
    setDivisionFilter('all')
    setStatusFilter('all')
    setExperienceFilter('all')
    setSortOption('newest')
    setCurrentPage(1)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logoutAdmin()
    onLogout()
  }

  const handleApplicationUpdated = (updated: ApplicationItem) => {
    setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
  }

  const renderStatusBadge = (status: CastingStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#398BFF]/15 text-[#70D7FF] border border-[#398BFF]/30">
            <Clock className="w-3 h-3" />
            <span>Mới</span>
          </span>
        )
      case 'reviewing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FFB45C]/15 text-[#FFB45C] border border-[#FFB45C]/30">
            <Eye className="w-3 h-3" />
            <span>Đang xem</span>
          </span>
        )
      case 'shortlisted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30">
            <Sparkles className="w-3 h-3" />
            <span>Shortlist</span>
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FF6B6B]/15 text-[#FF8E8E] border border-[#FF6B6B]/30">
            <ThumbsDown className="w-3 h-3" />
            <span>Không phù hợp</span>
          </span>
        )
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Đã chọn</span>
          </span>
        )
      default:
        return null
    }
  }

  const startRecord = (currentPage - 1) * 20 + 1
  const endRecord = Math.min(currentPage * 20, totalCount)

  return (
    <div className="min-h-screen bg-[#050D1A] text-[#F4F7FB] flex flex-col selection:bg-[#398BFF] selection:text-white">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 bg-[#09172B]/95 backdrop-blur-md border-b border-[#78B9F0]/15 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#398BFF] to-[#70D7FF] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_12px_#398BFF]">
              H
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-[#70D7FF] tracking-wider uppercase">
                HMC ADMIN
              </div>
              <div className="text-[11px] text-[#91A4BB]">Recruitment Portal 2026</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onNavigateHome}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-[#91A4BB] hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <span>Trang chủ</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#050D1A]/80 border border-[#78B9F0]/15 text-xs text-[#B8CDE5]">
            <User className="w-3.5 h-3.5 text-[#70D7FF]" />
            <span className="hidden md:inline font-mono">{currentUser.email}</span>
          </div>

          <button
            type="button"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 text-[#FF8E8E] border border-[#FF6B6B]/25 text-xs font-medium transition-colors cursor-pointer disabled:opacity-60"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 space-y-6">
        {/* Page Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif-display text-2xl sm:text-3xl text-white tracking-tight">
              DANH SÁCH ĐĂNG KÝ CTV
            </h1>
            <p className="text-xs sm:text-sm text-[#91A4BB] mt-0.5">
              Quản lý hồ sơ Vocal và Dancer Casting.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                exportClientCsv({
                  q: debouncedQuery,
                  division: divisionFilter,
                  status: statusFilter,
                  experience: experienceFilter,
                  sort: sortOption,
                })
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0D203A] hover:bg-[#132D50] text-[#70D7FF] border border-[#70D7FF]/25 text-xs font-semibold transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Xuất CSV</span>
            </button>

            <button
              type="button"
              onClick={loadData}
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-[#91A4BB] hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="Tải lại danh sách"
            >
              <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Total */}
          <div className="p-4 rounded-2xl bg-[#09172B] border border-[#78B9F0]/15 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#91A4BB] font-mono uppercase">
              <span>Tổng đơn</span>
              <Users className="w-4 h-4 text-[#398BFF]" />
            </div>
            <div className="font-serif-display text-2xl sm:text-3xl text-white">
              {counts.total}
            </div>
          </div>

          {/* Vocal */}
          <div className="p-4 rounded-2xl bg-[#09172B] border border-[#78B9F0]/15 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#91A4BB] font-mono uppercase">
              <span>Vocal Casting</span>
              <Mic className="w-4 h-4 text-[#70D7FF]" />
            </div>
            <div className="font-serif-display text-2xl sm:text-3xl text-[#70D7FF]">
              {counts.vocal}
            </div>
          </div>

          {/* Dancer */}
          <div className="p-4 rounded-2xl bg-[#09172B] border border-[#78B9F0]/15 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#91A4BB] font-mono uppercase">
              <span>Dancer Casting</span>
              <Activity className="w-4 h-4 text-[#D8B4FE]" />
            </div>
            <div className="font-serif-display text-2xl sm:text-3xl text-[#D8B4FE]">
              {counts.dancer}
            </div>
          </div>

          {/* New */}
          <div className="p-4 rounded-2xl bg-[#09172B] border border-[#78B9F0]/15 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#91A4BB] font-mono uppercase">
              <span>Hồ sơ mới</span>
              <Sparkles className="w-4 h-4 text-[#FFB45C]" />
            </div>
            <div className="font-serif-display text-2xl sm:text-3xl text-[#FFB45C]">
              {counts.new}
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#09172B] border border-[#78B9F0]/15 space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <input
                type="text"
                placeholder="Tìm theo họ tên hoặc mã số sinh viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[44px] pl-10 pr-4 rounded-xl bg-[#050D1A]/80 border border-[#78B9F0]/20 text-xs sm:text-sm text-[#F4F7FB] outline-none transition-all placeholder:text-[#91A4BB]/45 focus:border-[#70D7FF]"
              />
              <Search className="w-4 h-4 text-[#91A4BB] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Casting Division Filter */}
            <div className="md:col-span-2">
              <select
                value={divisionFilter}
                onChange={(e) => {
                  setDivisionFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full h-[44px] px-3 rounded-xl bg-[#050D1A]/80 border border-[#78B9F0]/20 text-xs sm:text-sm text-[#F4F7FB] outline-none transition-all focus:border-[#70D7FF] cursor-pointer"
              >
                <option value="all">Mảng: Tất cả</option>
                <option value="vocal">Vocal Casting</option>
                <option value="dancer">Dancer Casting</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="md:col-span-2">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full h-[44px] px-3 rounded-xl bg-[#050D1A]/80 border border-[#78B9F0]/20 text-xs sm:text-sm text-[#F4F7FB] outline-none transition-all focus:border-[#70D7FF] cursor-pointer"
              >
                <option value="all">Trạng thái: Tất cả</option>
                <option value="new">Mới</option>
                <option value="reviewing">Đang xem</option>
                <option value="shortlisted">Shortlist</option>
                <option value="accepted">Đã chọn</option>
                <option value="rejected">Không phù hợp</option>
              </select>
            </div>

            {/* Experience Filter */}
            <div className="md:col-span-3">
              <select
                value={experienceFilter}
                onChange={(e) => {
                  setExperienceFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full h-[44px] px-3 rounded-xl bg-[#050D1A]/80 border border-[#78B9F0]/20 text-xs sm:text-sm text-[#F4F7FB] outline-none transition-all focus:border-[#70D7FF] cursor-pointer"
              >
                <option value="all">Kinh nghiệm: Tất cả</option>
                <option value="true">Đã từng biểu diễn</option>
                <option value="false">Chưa từng biểu diễn</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications List View */}
        <div className="rounded-2xl bg-[#09172B] border border-[#78B9F0]/15 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          {isLoading ? (
            /* Skeleton Loading State */
            <div className="p-8 space-y-4">
              <div className="flex items-center justify-center gap-2.5 py-12 text-[#70D7FF]">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-sm font-medium">Đang tải danh sách hồ sơ...</span>
              </div>
            </div>
          ) : errorMessage ? (
            /* Error State */
            <div className="text-center py-16 px-4 space-y-3">
              <AlertCircle className="w-10 h-10 text-[#FF6B6B] mx-auto" />
              <p className="text-sm text-[#FF8E8E]">{errorMessage}</p>
              <button
                type="button"
                onClick={loadData}
                className="btn-primary-glow px-5 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer"
              >
                Thử lại
              </button>
            </div>
          ) : applications.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#91A4BB] mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white">Không tìm thấy hồ sơ phù hợp.</h3>
              <p className="text-xs text-[#91A4BB] max-w-sm mx-auto">
                Hãy thử điều chỉnh từ khóa tìm kiếm hoặc đặt lại bộ lọc để xem các hồ sơ khác.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                <span>Xóa bộ lọc</span>
              </button>
            </div>
          ) : (
            <>
              {/* DESKTOP / TABLET TABLE */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#050D1A]/50 text-[11px] font-mono uppercase tracking-wider text-[#91A4BB]">
                      <th className="py-3.5 px-4 w-12 text-center">STT</th>
                      <th className="py-3.5 px-4">Họ và tên</th>
                      <th className="py-3.5 px-4">MSSV</th>
                      <th className="py-3.5 px-4">Mảng</th>
                      <th className="py-3.5 px-4">Kinh nghiệm</th>
                      <th className="py-3.5 px-4">Bài casting</th>
                      <th className="py-3.5 px-4">Ngày đăng ký</th>
                      <th className="py-3.5 px-4">Trạng thái</th>
                      <th className="py-3.5 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {applications.map((app, index) => {
                      const stt = (currentPage - 1) * 20 + index + 1
                      return (
                        <tr
                          key={app.id}
                          onClick={() => setSelectedAppId(app.id)}
                          className="h-[64px] hover:bg-[#0E2A4D]/50 transition-colors cursor-pointer group"
                        >
                          <td className="py-3 px-4 text-center font-mono text-[#91A4BB]/70">
                            {stt < 10 ? `0${stt}` : stt}
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-semibold text-white group-hover:text-[#70D7FF] transition-colors">
                              {app.fullName}
                            </div>
                            <div className="text-[11px] text-[#91A4BB]/70 truncate max-w-[180px]">
                              {app.email}
                            </div>
                          </td>

                          <td className="py-3 px-4 font-mono text-[#B8CDE5] font-semibold">
                            {app.studentId}
                          </td>

                          <td className="py-3 px-4">
                            {app.castingDivision === 'vocal' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#398BFF]/20 text-[#70D7FF] border border-[#70D7FF]/35">
                                <Mic className="w-3 h-3" />
                                <span>Vocal</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#A855F7]/20 text-[#D8B4FE] border border-[#C084FC]/35">
                                <Activity className="w-3 h-3" />
                                <span>Dancer</span>
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            {app.hasPerformanceExperience ? (
                              <span className="text-[#34D399] font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Có</span>
                              </span>
                            ) : (
                              <span className="text-[#91A4BB]/60">Chưa</span>
                            )}
                          </td>

                          <td className="py-3 px-4 max-w-[180px] truncate text-white/90">
                            {app.castingSong}
                          </td>

                          <td className="py-3 px-4 text-[#91A4BB] font-mono text-[11px]">
                            {new Date(app.createdAt).toLocaleDateString('vi-VN')}
                          </td>

                          <td className="py-3 px-4">{renderStatusBadge(app.status)}</td>

                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedAppId(app.id)
                              }}
                              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#398BFF]/20 text-xs font-semibold text-[#91A4BB] hover:text-[#70D7FF] border border-white/10 hover:border-[#70D7FF]/40 transition-all cursor-pointer"
                            >
                              Xem chi tiết
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS VIEW */}
              <div className="md:hidden divide-y divide-white/5 p-3 space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => setSelectedAppId(app.id)}
                    className="p-4 rounded-2xl bg-[#050D1A]/60 border border-[#78B9F0]/15 space-y-3 cursor-pointer hover:border-[#70D7FF]/40 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-white">{app.fullName}</div>
                        <div className="text-xs font-mono text-[#70D7FF]">MSSV: {app.studentId}</div>
                      </div>
                      {renderStatusBadge(app.status)}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5 text-[#91A4BB]">
                      <div className="flex items-center gap-1.5">
                        {app.castingDivision === 'vocal' ? (
                          <Mic className="w-3.5 h-3.5 text-[#70D7FF]" />
                        ) : (
                          <Activity className="w-3.5 h-3.5 text-[#D8B4FE]" />
                        )}
                        <span className="capitalize">{app.castingDivision}</span>
                      </div>
                      <div>{new Date(app.createdAt).toLocaleDateString('vi-VN')}</div>
                    </div>

                    <div className="text-xs text-white/80 truncate">
                      <span className="text-[#91A4BB]">Bài: </span>
                      {app.castingSong}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedAppId(app.id)
                      }}
                      className="w-full py-2 rounded-xl bg-white/5 text-xs font-semibold text-[#70D7FF] border border-white/10 text-center"
                    >
                      Xem hồ sơ
                    </button>
                  </div>
                ))}
              </div>

              {/* PAGINATION BAR */}
              <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#91A4BB]">
                <div>
                  Hiển thị <span className="text-white font-semibold">{totalCount > 0 ? startRecord : 0}</span>–
                  <span className="text-white font-semibold">{endRecord}</span> trong tổng số{' '}
                  <span className="text-[#70D7FF] font-semibold">{totalCount}</span> hồ sơ
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="px-3 py-1 font-mono text-white">
                    Trang {currentPage} / {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Detail Slide Drawer */}
      {selectedAppId && (
        <ApplicantDetailDrawer
          applicationId={selectedAppId}
          applications={applications}
          onClose={() => setSelectedAppId(null)}
          onApplicationUpdated={handleApplicationUpdated}
        />
      )}
    </div>
  )
}
