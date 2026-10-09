import React, { useState, useEffect } from 'react'
import {
  Mail,
  Send,
  FileText,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Printer,
  Sparkles,
  Eye,
  ListFilter,
  Check,
  Download,
  ExternalLink,
} from 'lucide-react'
import { ApplicationItem } from '../../lib/adminApi'
import {
  sendConfirmationEmailsToAll,
  generatePersonalizedEmailHtml,
  getSentEmailIds,
  EmailDispatchProgress,
  EmailDispatchResult,
} from '../../lib/emailService'
import { exportAuditionPlanPdf, getAuditionPlanHtml } from '../../lib/auditionPlanPdf'

interface EmailConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  applications: ApplicationItem[]
  onSuccess?: () => void
}

export const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({
  isOpen,
  onClose,
  applications,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'preview_email' | 'preview_pdf' | 'recipients_list'>(
    'preview_email'
  )
  const [divisionScope, setDivisionScope] = useState<'all' | 'vocal' | 'dancer' | 'traditional_dance'>('all')
  const [customNote, setCustomNote] = useState(
    'Lưu ý: Các bạn vui lòng mang theo Thẻ sinh viên HUFLIT (hoặc CCCD/VNeID) khi đến check-in tại Phòng Hội thảo nhé!'
  )
  const [isSending, setIsSending] = useState(false)
  const [progress, setProgress] = useState<EmailDispatchProgress>({
    current: 0,
    total: 0,
    currentCandidate: null,
    status: 'idle',
    logs: [],
  })
  const [sentResult, setSentResult] = useState<EmailDispatchResult | null>(null)
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0)

  const sentEmailIds = getSentEmailIds()

  // Filter recipient candidates based on selected division scope
  const targetCandidates = applications.filter((app) => {
    if (divisionScope === 'all') return true
    return app.castingDivision === divisionScope
  })

  const previewCandidate =
    targetCandidates[selectedPreviewIndex] || targetCandidates[0] || applications[0]

  useEffect(() => {
    if (isOpen) {
      setSentResult(null)
      setIsSending(false)
      setProgress({
        current: 0,
        total: targetCandidates.length,
        currentCandidate: null,
        status: 'idle',
        logs: [],
      })
      setSelectedPreviewIndex(0)
    }
  }, [isOpen, divisionScope])

  if (!isOpen) return null

  const handleStartSending = async () => {
    if (targetCandidates.length === 0) {
      alert('Không có thí sinh nào trong danh sách được chọn.')
      return
    }

    const confirmSend = window.confirm(
      `Xác nhận gửi email xác nhận tham gia Casting kèm file PDF thể lệ cho ${targetCandidates.length} thí sinh?`
    )
    if (!confirmSend) return

    setIsSending(true)
    setSentResult(null)

    try {
      const result = await sendConfirmationEmailsToAll(
        targetCandidates,
        {
          customNote: customNote.trim(),
          includePdfAttachment: true,
        },
        (p) => setProgress(p)
      )

      setSentResult(result)
      if (onSuccess) onSuccess()
    } catch (err: any) {
      alert('Có lỗi khi gửi email: ' + (err.message || 'Lỗi không xác định.'))
    } finally {
      setIsSending(false)
    }
  }

  const handleOpenPdfFullWindow = () => {
    if (previewCandidate) {
      const divLabel =
        previewCandidate.castingDivision === 'vocal'
          ? 'Hát (Vocal)'
          : previewCandidate.castingDivision === 'dancer'
          ? 'Nhảy (Dance)'
          : 'Múa (Traditional / Contemporary)'
      exportAuditionPlanPdf(previewCandidate.fullName, previewCandidate.studentId, divLabel)
    } else {
      exportAuditionPlanPdf()
    }
  }

  const percentComplete =
    progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#09172B] border border-[#78B9F0]/30 rounded-3xl w-full max-w-5xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col max-h-[92vh]">
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#050D1A]/70">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#398BFF]/30 to-[#70D7FF]/20 border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF] shadow-[0_0_15px_rgba(57,139,255,0.3)]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-display text-lg sm:text-xl text-white">
                  Gửi Email Xác Nhận Casting &amp; Thể Lệ PDF
                </h3>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#398BFF]/20 text-[#70D7FF] border border-[#70D7FF]/30">
                  HMC 2026
                </span>
              </div>
              <p className="text-xs text-[#91A4BB] mt-0.5">
                Gửi thư xác nhận kèm toàn văn Kế hoạch &amp; Thể lệ tuyển CTV năm học 2026 – 2027 cho thí sinh.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isSending}
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#91A4BB] hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* RECIPIENTS TARGET SELECTOR BAR */}
        <div className="px-4 sm:px-6 py-3 bg-[#071527] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#91A4BB] font-mono uppercase text-[11px] flex items-center gap-1">
              <ListFilter className="w-3.5 h-3.5 text-[#70D7FF]" />
              Phạm vi gửi:
            </span>
            <div className="flex gap-1.5 bg-[#050D1A] p-1 rounded-xl border border-white/10">
              <button
                type="button"
                disabled={isSending}
                onClick={() => setDivisionScope('all')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  divisionScope === 'all'
                    ? 'bg-[#398BFF] text-white shadow-sm'
                    : 'text-[#91A4BB] hover:text-white'
                }`}
              >
                Tất cả ({applications.length})
              </button>
              <button
                type="button"
                disabled={isSending}
                onClick={() => setDivisionScope('vocal')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  divisionScope === 'vocal'
                    ? 'bg-[#398BFF] text-white shadow-sm'
                    : 'text-[#91A4BB] hover:text-white'
                }`}
              >
                Hát ({applications.filter((a) => a.castingDivision === 'vocal').length})
              </button>
              <button
                type="button"
                disabled={isSending}
                onClick={() => setDivisionScope('dancer')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  divisionScope === 'dancer'
                    ? 'bg-[#A855F7] text-white shadow-sm'
                    : 'text-[#91A4BB] hover:text-white'
                }`}
              >
                Nhảy ({applications.filter((a) => a.castingDivision === 'dancer').length})
              </button>
              <button
                type="button"
                disabled={isSending}
                onClick={() => setDivisionScope('traditional_dance')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  divisionScope === 'traditional_dance'
                    ? 'bg-[#FB7185] text-white shadow-sm'
                    : 'text-[#91A4BB] hover:text-white'
                }`}
              >
                Múa ({applications.filter((a) => a.castingDivision === 'traditional_dance').length})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#91A4BB]">Số lượng gửi:</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-[#70D7FF]/20 text-[#70D7FF] font-bold font-mono">
              {targetCandidates.length} thí sinh
            </span>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-white/10 bg-[#061120] px-4 sm:px-6 gap-2 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('preview_email')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-semibold text-xs transition-all cursor-pointer ${
              activeTab === 'preview_email'
                ? 'border-[#70D7FF] text-[#70D7FF]'
                : 'border-transparent text-[#91A4BB] hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>1. Xem trước Email xác nhận</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview_pdf')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-semibold text-xs transition-all cursor-pointer ${
              activeTab === 'preview_pdf'
                ? 'border-[#FFE082] text-[#FFE082]'
                : 'border-transparent text-[#91A4BB] hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>2. File PDF Thể Lệ (Nền Web)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recipients_list')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-semibold text-xs transition-all cursor-pointer ${
              activeTab === 'recipients_list'
                ? 'border-[#70D7FF] text-[#70D7FF]'
                : 'border-transparent text-[#91A4BB] hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>3. Danh sách người nhận ({targetCandidates.length})</span>
          </button>
        </div>

        {/* MODAL MAIN CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* TAB 1: PREVIEW EMAIL */}
          {activeTab === 'preview_email' && (
            <div className="space-y-4">
              {/* Optional Custom Note Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#B8CDE5] uppercase tracking-wider block">
                  Lời nhắn từ Ban Tổ Chức (Tùy chọn - Gửi kèm trong email):
                </label>
                <textarea
                  rows={2}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Nhập ghi chú thêm cho thí sinh..."
                  className="w-full p-3 rounded-xl bg-[#050D1A]/80 border border-[#78B9F0]/20 text-xs text-white outline-none focus:border-[#70D7FF] transition-all"
                />
              </div>

              {/* Recipient Selector for live preview */}
              {targetCandidates.length > 1 && (
                <div className="flex items-center justify-between text-xs text-[#91A4BB] bg-[#050D1A]/60 p-2.5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-[#70D7FF]" />
                    <span>Xem trước email gửi cho thí sinh:</span>
                  </div>
                  <select
                    value={selectedPreviewIndex}
                    onChange={(e) => setSelectedPreviewIndex(Number(e.target.value))}
                    className="bg-[#09172B] border border-[#78B9F0]/30 rounded-lg px-2 py-1 text-xs text-[#70D7FF] outline-none cursor-pointer"
                  >
                    {targetCandidates.map((c, idx) => (
                      <option key={c.id} value={idx}>
                        {c.fullName} ({c.studentId}) — {c.castingDivision.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Rendered Email Preview Container */}
              {previewCandidate && (
                <div className="rounded-2xl border border-[#78B9F0]/25 overflow-hidden shadow-inner bg-[#030811] p-3 sm:p-5 max-h-[420px] overflow-y-auto">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: generatePersonalizedEmailHtml(previewCandidate, {
                        customNote: customNote.trim(),
                      }),
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PREVIEW PDF THE LE */}
          {activeTab === 'preview_pdf' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#050D1A]/80 p-3 rounded-xl border border-[#78B9F0]/20">
                <div>
                  <div className="text-xs font-bold text-[#FFE082] uppercase">
                    VĂN BẢN: KẾ HOẠCH TỔ CHỨC TUYỂN THÀNH VIÊN CLB ÂM NHẠC HUFLIT (2026 - 2027)
                  </div>
                  <div className="text-[11px] text-[#91A4BB]">
                    Định dạng nền màu Dark Navy đồng bộ website, chuẩn khổ in A4.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenPdfFullWindow}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#398BFF]/20 hover:bg-[#398BFF]/30 text-[#70D7FF] border border-[#70D7FF]/40 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Mở cửa sổ In / Tải PDF</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Embedded Frame Preview */}
              <div className="rounded-2xl border border-[#78B9F0]/25 overflow-hidden h-[420px] bg-[#050D1A]">
                <iframe
                  title="PDF Rules Preview"
                  srcDoc={getAuditionPlanHtml(
                    previewCandidate?.fullName,
                    previewCandidate?.studentId,
                    previewCandidate?.castingDivision
                  )}
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          )}

          {/* TAB 3: RECIPIENTS LIST */}
          {activeTab === 'recipients_list' && (
            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#050D1A]/70">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#071527] text-[11px] font-mono uppercase text-[#91A4BB] border-b border-white/10">
                      <th className="py-2.5 px-4 text-center w-12">STT</th>
                      <th className="py-2.5 px-4">Họ và tên</th>
                      <th className="py-2.5 px-4">MSSV</th>
                      <th className="py-2.5 px-4">Email</th>
                      <th className="py-2.5 px-4">Mảng</th>
                      <th className="py-2.5 px-4 text-center">Trạng thái email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {targetCandidates.map((c, idx) => {
                      const isSent = sentEmailIds.has(c.id)
                      return (
                        <tr key={c.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-2.5 px-4 text-center font-mono text-[#91A4BB]">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-4 font-semibold text-white">{c.fullName}</td>
                          <td className="py-2.5 px-4 font-mono text-[#70D7FF]">{c.studentId}</td>
                          <td className="py-2.5 px-4 text-[#B8CDE5] font-mono">{c.email}</td>
                          <td className="py-2.5 px-4">
                            {c.castingDivision === 'vocal' ? (
                              <span className="text-[#70D7FF] font-medium">Hát</span>
                            ) : c.castingDivision === 'dancer' ? (
                              <span className="text-[#D8B4FE] font-medium">Nhảy</span>
                            ) : (
                              <span className="text-[#FDA4AF] font-medium">Múa</span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            {isSent ? (
                              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30">
                                <Check className="w-3 h-3" />
                                Đã gửi trước đó
                              </span>
                            ) : (
                              <span className="text-[11px] text-[#91A4BB]">Sẵn sàng gửi</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DISPATCH PROGRESS & LOG TERMINAL */}
          {(isSending || sentResult) && (
            <div className="space-y-3 pt-3 border-t border-white/10">
              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#B8CDE5] font-medium flex items-center gap-1.5">
                    {isSending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#70D7FF]" />
                        <span>
                          Đang gửi email: <strong>{progress.current}</strong> / {progress.total} (
                          {percentComplete}%)
                        </span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                        <span className="text-[#34D399] font-bold">
                          Đã gửi thành công 100% ({sentResult?.totalSent} email)!
                        </span>
                      </>
                    )}
                  </span>
                  <span className="font-mono text-xs text-[#70D7FF] font-bold">
                    {percentComplete}%
                  </span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-[#050D1A] overflow-hidden border border-[#78B9F0]/20">
                  <div
                    className="h-full bg-gradient-to-r from-[#398BFF] via-[#70D7FF] to-[#34D399] transition-all duration-300"
                    style={{ width: `${percentComplete}%` }}
                  />
                </div>
              </div>

              {/* Logs Terminal */}
              <div className="bg-[#030811] p-3 rounded-xl border border-white/10 font-mono text-[11px] text-[#70D7FF] max-h-[120px] overflow-y-auto space-y-1">
                {progress.logs.map((log, idx) => (
                  <div key={idx} className="leading-tight">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER ACTIONS */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-[#050D1A]/80 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#91A4BB]">
            {sentResult ? (
              <span className="text-[#34D399] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Đã hoàn tất gửi email xác nhận &amp; thể lệ cho toàn bộ thí sinh.
              </span>
            ) : (
              <span>
                Chỉ thực hiện gửi khi Admin nhấn nút xác nhận bên dưới.
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isSending}
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#91A4BB] hover:text-white transition-colors cursor-pointer"
            >
              {sentResult ? 'Đóng' : 'Hủy bỏ'}
            </button>

            <button
              type="button"
              disabled={isSending || targetCandidates.length === 0}
              onClick={handleStartSending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#398BFF] via-[#2563EB] to-[#70D7FF] hover:from-[#1D4ED8] hover:to-[#38BDF8] text-white text-xs font-bold transition-all cursor-pointer shadow-[0_0_20px_rgba(57,139,255,0.4)] disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang tiến hành gửi...</span>
                </>
              ) : sentResult ? (
                <>
                  <Send className="w-4 h-4" />
                  <span>Gửi lại cho danh sách này</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Gửi Email Cho Toàn Bộ ({targetCandidates.length} Thí Sinh)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
