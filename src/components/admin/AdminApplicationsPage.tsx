import React, { useState, useEffect } from 'react'
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
  LogOut,
  Users,
  User,
  AlertCircle,
  Loader2,
  Printer,
  FileText,
  ArrowDownAZ,
  Filter,
  X,
  Mail,
  Send,
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
import { exportScoreSheetPdf, sortCandidatesByDivisionAndName } from '../../lib/pdfScoreSheet'
import { getSentEmailIds } from '../../lib/emailService'
import { ApplicantDetailDrawer } from './ApplicantDetailDrawer'
import { EmailConfirmationModal } from './EmailConfirmationModal'

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
    traditional_dance: 0,
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

  // PDF Score Sheet Export Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)
  const [pdfDivisionScope, setPdfDivisionScope] = useState<'all' | 'vocal' | 'dancer' | 'traditional_dance'>('all')
  const [pdfJudgeName, setPdfJudgeName] = useState('')
  const [pdfRoomName, setPdfRoomName] = useState('Phòng Hội thảo, tầng 1 – Cơ sở Sư Vạn Hạnh, HUFLIT')
  const [pdfAuditionDate, setPdfAuditionDate] = useState('06/11 & 07/11/2026')
  const [isExportingPdf, setIsExportingPdf] = useState(false)

  // Email Confirmation Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [allCandidatesForEmail, setAllCandidatesForEmail] = useState<ApplicationItem[]>([])
  const [isLoadingEmailCandidates, setIsLoadingEmailCandidates] = useState(false)
  const [sentEmailIdsSet, setSentEmailIdsSet] = useState<Set<string>>(() => getSentEmailIds())

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
      setSentEmailIdsSet(getSentEmailIds())
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

  const handleOpenEmailModal = async () => {
    setIsLoadingEmailCandidates(true)
    try {
      const res = await fetchApplications({ page: 1, limit: 1000 })
      setAllCandidatesForEmail(res.applications)
    } catch {
      setAllCandidatesForEmail(applications)
    } finally {
      setIsLoadingEmailCandidates(false)
      setIsEmailModalOpen(true)
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

  const handleQuickSortByDivision = () => {
    setSortOption('division_name_asc')
    setCurrentPage(1)
  }

  const handleOpenPdfModal = () => {
    if (divisionFilter === 'vocal' || divisionFilter === 'dancer' || divisionFilter === 'traditional_dance') {
      setPdfDivisionScope(divisionFilter as any)
    } else {
      setPdfDivisionScope('all')
    }
    setIsPdfModalOpen(true)
  }

  const handleExecutePdfExport = async () => {
    setIsExportingPdf(true)
    try {
      const res = await fetchApplications({
        q: debouncedQuery,
        division: pdfDivisionScope !== 'all' ? pdfDivisionScope : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        experience: experienceFilter !== 'all' ? experienceFilter : undefined,
        sort: 'division_name_asc',
        page: 1,
        limit: 1000,
      })

      const listToExport = res.applications
      if (!listToExport || listToExport.length === 0) {
        alert('Không có thí sinh nào phù hợp với điều kiện để xuất phiếu chấm điểm.')
        return
      }

      exportScoreSheetPdf(listToExport, {
        division: pdfDivisionScope,
        judgeName: pdfJudgeName.trim(),
        roomName: pdfRoomName.trim() || 'Phòng Hội thảo, tầng 1 – Cơ sở Sư Vạn Hạnh, HUFLIT',
        auditionDate: pdfAuditionDate.trim() || '06/11 & 07/11/2026',
      })
      setIsPdfModalOpen(false)
    } catch (err: any) {
      alert('Lỗi xuất PDF: ' + (err.message || 'Không thể tạo file PDF.'))
    } finally {
      setIsExportingPdf(false)
    }
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
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#70D7FF]/40 flex items-center justify-center bg-[#071A33] shadow-[0_0_10px_rgba(57,139,255,0.4)] shrink-0">
              <img
                src="/assets/music-club/shared/hmc_logo.jpg"
                alt="HMC Logo"
                className="w-full h-full object-cover"
              />
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
              Quản lý hồ sơ Tuyển CTV CLB Âm nhạc HUFLIT (Hát, Nhảy, Múa).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleOpenEmailModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#6366F1] via-[#3B82F6] to-[#06B6D4] hover:from-[#4F46E5] hover:to-[#0891B2] text-white text-xs font-bold transition-all cursor-pointer shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Mail className="w-4 h-4" />
              <span>Gửi Mail Xác Nhận (Kèm Thể Lệ PDF)</span>
            </button>

            <button
              type="button"
              onClick={handleOpenPdfModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#398BFF] to-[#70D7FF] hover:from-[#2563EB] hover:to-[#38BDF8] text-white text-xs font-bold transition-all cursor-pointer shadow-[0_0_20px_rgba(57,139,255,0.4)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Printer className="w-4 h-4" />
              <span>Xuất PDF Chấm Điểm (A-Z)</span>
            </button>

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
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
              <span>Hát (Vocal)</span>
              <Mic className="w-4 h-4 text-[#70D7FF]" />
            </div>
            <div className="font-serif-display text-2xl sm:text-3xl text-[#70D7FF]">
              {counts.vocal}
            </div>
          </div>

          {/* Dancer */}
          <div className="p-4 rounded-2xl bg-[#09172B] border border-[#78B9F0]/15 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#91A4BB] font-mono uppercase">
              <span>Nhảy (Dance)</span>
              <Activity className="w-4 h-4 text-[#D8B4FE]" />
            </div>
            <div className="font-serif-display text-2xl sm:text-3xl text-[#D8B4FE]">
              {counts.dancer}
            </div>
          </div>

          {/* Traditional Dance / Múa */}
          <div className="p-4 rounded-2xl bg-[#09172B] border border-[#78B9F0]/15 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#91A4BB] font-mono uppercase">
              <span>Múa</span>
              <Sparkles className="w-4 h-4 text-[#FB7185]" />
            </div>
            <div className="font-serif-display text-2xl sm:text-3xl text-[#FB7185]">
              {counts.traditional_dance ?? 0}
            </div>
          </div>

          {/* New */}
          <div className="p-4 rounded-2xl bg-[#09172B] border border-[#78B9F0]/15 space-y-1 col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-xs text-[#91A4BB] font-mono uppercase">
              <span>Hồ sơ mới</span>
              <Clock className="w-4 h-4 text-[#FFB45C]" />
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
            <div className="md:col-span-4 relative">
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
                <option value="vocal">Hát (Vocal)</option>
                <option value="dancer">Nhảy (Dance)</option>
                <option value="traditional_dance">Múa</option>
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
            <div className="md:col-span-2">
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

            {/* Sort Order Selector */}
            <div className="md:col-span-2">
              <select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full h-[44px] px-3 rounded-xl bg-[#050D1A]/80 border border-[#78B9F0]/20 text-xs sm:text-sm text-[#70D7FF] font-medium outline-none transition-all focus:border-[#70D7FF] cursor-pointer"
              >
                <option value="newest">Mới nhất (Mặc định)</option>
                <option value="division_name_asc">Tên (A → Z theo mảng)</option>
                <option value="name_asc">Tên (A → Z toàn bộ)</option>
                <option value="name_desc">Tên (Z → A)</option>
                <option value="oldest">Cũ nhất</option>
                <option value="mssv_asc">MSSV tăng dần</option>
              </select>
            </div>
          </div>

          {/* Quick Filter & Sort Tags Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-white/5 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[#91A4BB] text-[11px] font-mono flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3 text-[#70D7FF]" />
                SẮP XẾP NHANH:
              </span>

              <button
                type="button"
                onClick={handleQuickSortByDivision}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  sortOption === 'division_name_asc'
                    ? 'bg-[#398BFF]/25 text-[#70D7FF] border border-[#70D7FF]/50 shadow-[0_0_12px_rgba(57,139,255,0.3)]'
                    : 'bg-white/5 hover:bg-white/10 text-[#B8CDE5] border border-white/10'
                }`}
              >
                <ArrowDownAZ className="w-3.5 h-3.5 text-[#70D7FF]" />
                <span>Sắp xếp A → Z theo từng mảng</span>
                {sortOption === 'division_name_asc' && (
                  <span className="w-2 h-2 rounded-full bg-[#70D7FF] animate-pulse" />
                )}
              </button>
            </div>

            {(searchQuery || divisionFilter !== 'all' || statusFilter !== 'all' || experienceFilter !== 'all' || sortOption !== 'newest') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-[11px] text-[#FF8E8E] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Đặt lại bộ lọc</span>
              </button>
            )}
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
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white group-hover:text-[#70D7FF] transition-colors">
                                {app.fullName}
                              </span>
                              {sentEmailIdsSet.has(app.id) && (
                                <span
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#10B981]/15 text-[#34D399] text-[10px] font-mono border border-[#10B981]/30"
                                  title="Đã gửi email xác nhận kèm file thể lệ"
                                >
                                  <Mail className="w-2.5 h-2.5" />
                                  <span>Đã gửi mail</span>
                                </span>
                              )}
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
                                <span>Hát</span>
                              </span>
                            ) : app.castingDivision === 'dancer' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#A855F7]/20 text-[#D8B4FE] border border-[#C084FC]/35">
                                <Activity className="w-3 h-3" />
                                <span>Nhảy</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#F43F5E]/20 text-[#FDA4AF] border border-[#FB7185]/35">
                                <Sparkles className="w-3 h-3" />
                                <span>Múa</span>
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
                        <div className="font-semibold text-white flex items-center gap-2">
                          <span>{app.fullName}</span>
                          {sentEmailIdsSet.has(app.id) && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#10B981]/15 text-[#34D399] text-[10px] font-mono border border-[#10B981]/30">
                              <Mail className="w-2.5 h-2.5" />
                              <span>Đã gửi mail</span>
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-mono text-[#70D7FF]">MSSV: {app.studentId}</div>
                      </div>
                      {renderStatusBadge(app.status)}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5 text-[#91A4BB]">
                      <div className="flex items-center gap-1.5">
                        {app.castingDivision === 'vocal' ? (
                          <>
                            <Mic className="w-3.5 h-3.5 text-[#70D7FF]" />
                            <span className="font-medium text-[#70D7FF]">Hát (Vocal)</span>
                          </>
                        ) : app.castingDivision === 'dancer' ? (
                          <>
                            <Activity className="w-3.5 h-3.5 text-[#D8B4FE]" />
                            <span className="font-medium text-[#D8B4FE]">Nhảy (Dance)</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-[#FDA4AF]" />
                            <span className="font-medium text-[#FDA4AF]">Múa</span>
                          </>
                        )}
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

      {/* PDF Score Sheet Export Modal */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#09172B] border border-[#78B9F0]/30 rounded-3xl w-full max-w-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#050D1A]/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#398BFF]/20 border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF]">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-display text-lg sm:text-xl text-white">
                    Xuất Phiếu Chấm Điểm Casting
                  </h3>
                  <p className="text-xs text-[#91A4BB]">
                    Tự động sắp xếp A → Z theo mảng &amp; tạo ô nhận xét 8 dòng cho GK
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPdfModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#91A4BB] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
              {/* Division Scope */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#B8CDE5] uppercase tracking-wider block">
                  1. Chọn mảng casting cần in
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPdfDivisionScope('all')}
                    className={`p-3 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                      pdfDivisionScope === 'all'
                        ? 'bg-[#398BFF]/20 border-[#70D7FF] text-[#70D7FF] shadow-[0_0_12px_rgba(57,139,255,0.3)]'
                        : 'bg-[#050D1A]/60 border-white/10 text-[#91A4BB] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    Tất cả ({counts.total})
                  </button>

                  <button
                    type="button"
                    onClick={() => setPdfDivisionScope('vocal')}
                    className={`p-3 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                      pdfDivisionScope === 'vocal'
                        ? 'bg-[#398BFF]/20 border-[#70D7FF] text-[#70D7FF] shadow-[0_0_12px_rgba(57,139,255,0.3)]'
                        : 'bg-[#050D1A]/60 border-white/10 text-[#91A4BB] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    Hát ({counts.vocal})
                  </button>

                  <button
                    type="button"
                    onClick={() => setPdfDivisionScope('dancer')}
                    className={`p-3 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                      pdfDivisionScope === 'dancer'
                        ? 'bg-[#A855F7]/20 border-[#C084FC] text-[#D8B4FE] shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                        : 'bg-[#050D1A]/60 border-white/10 text-[#91A4BB] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    Nhảy ({counts.dancer})
                  </button>

                  <button
                    type="button"
                    onClick={() => setPdfDivisionScope('traditional_dance')}
                    className={`p-3 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                      pdfDivisionScope === 'traditional_dance'
                        ? 'bg-[#F43F5E]/20 border-[#FB7185] text-[#FDA4AF] shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                        : 'bg-[#050D1A]/60 border-white/10 text-[#91A4BB] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    Múa ({counts.traditional_dance || 0})
                  </button>
                </div>
              </div>

              {/* Judge Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#B8CDE5] uppercase tracking-wider block">
                  2. Tên Giám Khảo (Tùy chọn - In sẵn vào phiếu)
                </label>
                <input
                  type="text"
                  placeholder="VD: Thầy / Cô / Anh / Chị Giám Khảo..."
                  value={pdfJudgeName}
                  onChange={(e) => setPdfJudgeName(e.target.value)}
                  className="w-full h-[42px] px-3.5 rounded-xl bg-[#050D1A]/80 border border-[#78B9F0]/20 text-xs sm:text-sm text-white outline-none focus:border-[#70D7FF] transition-all placeholder:text-[#91A4BB]/40"
                />
              </div>

              {/* Location & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#B8CDE5] uppercase tracking-wider block">
                    3. Địa điểm Casting
                  </label>
                  <input
                    type="text"
                    value={pdfRoomName}
                    onChange={(e) => setPdfRoomName(e.target.value)}
                    className="w-full h-[42px] px-3.5 rounded-xl bg-[#050D1A]/80 border border-[#78B9F0]/20 text-xs sm:text-sm text-white outline-none focus:border-[#70D7FF] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#B8CDE5] uppercase tracking-wider block">
                    4. Thời gian Casting
                  </label>
                  <input
                    type="text"
                    value={pdfAuditionDate}
                    onChange={(e) => setPdfAuditionDate(e.target.value)}
                    className="w-full h-[42px] px-3.5 rounded-xl bg-[#050D1A]/80 border border-[#78B9F0]/20 text-xs sm:text-sm text-white outline-none focus:border-[#70D7FF] transition-all"
                  />
                </div>
              </div>

              {/* Info Highlight Box */}
              <div className="p-4 rounded-2xl bg-[#050D1A]/60 border border-[#78B9F0]/20 text-xs space-y-2 text-[#91A4BB]">
                <div className="flex items-center gap-2 text-[#70D7FF] font-semibold">
                  <FileText className="w-4 h-4" />
                  <span>Quy cách mẫu phiếu chấm điểm HMC 2026:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11.5px] leading-relaxed text-[#B8CDE5]">
                  <li>Được phân loại theo từng mảng: <strong>Hát → Nhảy → Múa</strong>.</li>
                  <li>Tên thí sinh được <strong>sắp xếp chuẩn bảng chữ cái tiếng Việt (A → Z)</strong> theo tên gọi.</li>
                  <li>Mỗi hồ sơ có bảng điểm 3 tiêu chí (thang 30) và <strong>ô nhận xét 8 dòng có kẻ hàng chi tiết</strong>.</li>
                  <li>Tương thích in A4 hoặc xuất file PDF trực tiếp từ trình duyệt.</li>
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 sm:p-6 border-t border-white/10 bg-[#050D1A]/60 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsPdfModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#91A4BB] hover:text-white transition-colors cursor-pointer"
              >
                Hủy
              </button>

              <button
                type="button"
                disabled={isExportingPdf}
                onClick={handleExecutePdfExport}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#398BFF] to-[#70D7FF] hover:from-[#2563EB] hover:to-[#38BDF8] text-white text-xs font-bold transition-all cursor-pointer shadow-[0_0_20px_rgba(57,139,255,0.4)] disabled:opacity-60"
              >
                {isExportingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang tạo file PDF...</span>
                  </>
                ) : (
                  <>
                    <Printer className="w-4 h-4" />
                    <span>Xem &amp; In Phiếu PDF (A4)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Confirmation Modal */}
      <EmailConfirmationModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        applications={allCandidatesForEmail.length > 0 ? allCandidatesForEmail : applications}
        onSuccess={() => {
          setSentEmailIdsSet(getSentEmailIds())
          loadData()
        }}
      />

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
