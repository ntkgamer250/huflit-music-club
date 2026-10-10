import React from 'react'
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react'
import { ApplicationItem } from '../../lib/adminApi'

interface DeleteConfirmModalProps {
  isOpen: boolean
  candidate: ApplicationItem | null
  candidateList?: ApplicationItem[]
  isBatch?: boolean
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  candidate,
  candidateList = [],
  isBatch = false,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null

  const count = isBatch ? candidateList.length : 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#09172B] border border-red-500/40 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_25px_60px_rgba(255,0,0,0.2)] p-6 space-y-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">
              {isBatch ? `Xác nhận xóa ${count} thí sinh?` : 'Xác nhận xóa hồ sơ?'}
            </h3>
            <p className="text-xs text-[#91A4BB] leading-relaxed">
              {isBatch ? (
                <>
                  Bạn đang chuẩn bị xóa <strong>{count} thí sinh</strong> đã chọn khỏi danh sách tuyển sinh. Hành động này không thể hoàn tác.
                </>
              ) : (
                <>
                  Bạn có chắc chắn muốn xóa hồ sơ của{' '}
                  <strong className="text-white">{candidate?.fullName}</strong> ({candidate?.studentId}) không? Dữ liệu sẽ bị xóa hoàn toàn.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Small List Preview for Batch */}
        {isBatch && candidateList.length > 0 && (
          <div className="max-h-36 overflow-y-auto rounded-xl bg-[#050D1A]/80 border border-white/10 p-2.5 space-y-1.5 custom-scrollbar text-xs">
            {candidateList.slice(0, 8).map((c) => (
              <div key={c.id} className="flex items-center justify-between text-[#C9D9EC] py-0.5 px-1">
                <span className="truncate font-medium">{c.fullName}</span>
                <span className="font-mono text-[11px] text-[#70D7FF]">{c.studentId}</span>
              </div>
            ))}
            {candidateList.length > 8 && (
              <p className="text-[11px] text-[#91A4BB] text-center pt-1 italic">
                ...và {candidateList.length - 8} thí sinh khác
              </p>
            )}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xóa...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Xác nhận xóa</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
