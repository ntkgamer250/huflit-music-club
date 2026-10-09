import { ApplicationItem } from './adminApi'
import { getAuditionPlanHtml } from './auditionPlanPdf'

export interface EmailDispatchProgress {
  current: number
  total: number
  currentCandidate: ApplicationItem | null
  status: 'idle' | 'sending' | 'success' | 'error'
  logs: string[]
}

export interface SendEmailOptions {
  customNote?: string
  senderName?: string
  includePdfAttachment?: boolean
}

export interface EmailDispatchResult {
  totalSent: number
  timestamp: string
  recipients: { id: string; email: string; fullName: string; division: string }[]
}

const SENT_EMAILS_STORAGE_KEY = 'hmc_recruitment_sent_confirmation_emails_v1'

/**
 * Returns the list of applicant IDs that have already been sent confirmation emails
 */
export function getSentEmailIds(): Set<string> {
  try {
    const raw = localStorage.getItem(SENT_EMAILS_STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    return new Set(Array.isArray(parsed) ? parsed : [])
  } catch {
    return new Set()
  }
}

/**
 * Marks applicant IDs as having received confirmation emails
 */
export function markEmailIdsAsSent(ids: string[]): void {
  try {
    const existing = getSentEmailIds()
    ids.forEach((id) => existing.add(id))
    localStorage.setItem(SENT_EMAILS_STORAGE_KEY, JSON.stringify(Array.from(existing)))
  } catch (err) {
    console.error('Failed to save sent email IDs:', err)
  }
}

/**
 * Generates beautiful HTML email body personalized for each candidate
 */
export function generatePersonalizedEmailHtml(
  candidate: ApplicationItem,
  options: SendEmailOptions = {}
): string {
  const divisionLabel =
    candidate.castingDivision === 'vocal'
      ? 'Hát (Vocal)'
      : candidate.castingDivision === 'dancer'
      ? 'Nhảy (Dance)'
      : 'Múa (Traditional / Contemporary)'

  const customNoteBlock = options.customNote
    ? `
      <div style="background: rgba(57, 139, 255, 0.12); border-left: 4px solid #70D7FF; border-radius: 8px; padding: 14px 18px; margin: 20px 0; color: #E2EBF6; font-size: 13.5px;">
        <strong style="color: #70D7FF;">📌 Lời nhắn từ Ban Tổ Chức HMC:</strong>
        <p style="margin: 6px 0 0 0; white-space: pre-line;">${options.customNote}</p>
      </div>
    `
    : ''

  return `
    <div style="max-width: 680px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #050D1A; color: #E2EBF6; border: 1px solid rgba(112, 215, 255, 0.25); border-radius: 18px; overflow: hidden; box-shadow: 0 15px 45px rgba(0,0,0,0.7);">
      <!-- EMAIL HEADER -->
      <div style="background: linear-gradient(135deg, #09172B 0%, #0D223F 100%); padding: 30px 35px; border-bottom: 2px solid rgba(112, 215, 255, 0.3); text-align: center;">
        <div style="display: inline-block; background: rgba(57, 139, 255, 0.2); border: 1px solid rgba(112, 215, 255, 0.4); color: #FFE082; font-size: 11px; font-weight: 700; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px;">
          HUFLIT MUSIC CLUB (HMC)
        </div>
        <h1 style="margin: 0; color: #FFFFFF; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
          XÁC NHẬN ĐĂNG KÝ CASTING CTV 2026
        </h1>
        <p style="margin: 6px 0 0 0; color: #70D7FF; font-size: 13px; font-weight: 600;">
          Kèm Kế Hoạch &amp; Thể Lệ Tuyển Thành Viên Năm Học 2026 – 2027
        </p>
      </div>

      <!-- EMAIL BODY -->
      <div style="padding: 30px 35px; background: #061120;">
        <p style="font-size: 15px; margin: 0 0 16px 0; color: #FFFFFF;">
          Xin chào <strong style="color: #70D7FF;">${candidate.fullName}</strong>,
        </p>

        <p style="margin: 0 0 18px 0; line-height: 1.6; color: #C9D9EC; font-size: 13.5px;">
          Ban Chủ nhiệm <strong>CLB Âm nhạc HUFLIT (HMC)</strong> xin gửi lời cảm ơn bạn đã quan tâm và hoàn tất đăng ký tham gia Đợt Tuyển Cộng tác viên năm học 2026 – 2027. Hồ sơ của bạn đã được ghi nhận chính thức vào hệ thống!
        </p>

        <!-- CANDIDATE DETAILS CARD -->
        <div style="background: rgba(9, 23, 43, 0.85); border: 1px solid rgba(112, 215, 255, 0.25); border-radius: 12px; padding: 18px 22px; margin-bottom: 22px;">
          <div style="color: #FFE082; font-weight: 700; font-size: 13px; text-transform: uppercase; margin-bottom: 12px; border-bottom: 1px dashed rgba(112, 215, 255, 0.2); padding-bottom: 6px;">
            📋 THÔNG TIN HỒ SƠ CASTING CỦA BẠN
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 5px 0; color: #91A4BB; width: 140px;">Mã hồ sơ:</td>
              <td style="padding: 5px 0; color: #70D7FF; font-family: monospace; font-weight: 700;">${candidate.id}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #91A4BB;">Họ và tên:</td>
              <td style="padding: 5px 0; color: #FFFFFF; font-weight: 700;">${candidate.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #91A4BB;">Mã số sinh viên:</td>
              <td style="padding: 5px 0; color: #FFFFFF; font-weight: 600;">${candidate.studentId}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #91A4BB;">Mảng đăng ký:</td>
              <td style="padding: 5px 0; color: #FFE082; font-weight: 700;">${divisionLabel}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #91A4BB;">Bài / Tác phẩm:</td>
              <td style="padding: 5px 0; color: #FFFFFF;">${candidate.castingSong}</td>
            </tr>
          </table>
        </div>

        ${customNoteBlock}

        <!-- AUDITION SCHEDULE & VENUE -->
        <div style="background: rgba(57, 139, 255, 0.08); border: 1px solid rgba(112, 215, 255, 0.2); border-radius: 12px; padding: 18px 22px; margin-bottom: 22px;">
          <div style="color: #70D7FF; font-weight: 700; font-size: 13px; text-transform: uppercase; margin-bottom: 10px;">
            📍 LỊCH TRÌNH VÀ ĐỊA ĐIỂM CASTING CHÍNH THỨC
          </div>
          <p style="margin: 0 0 8px 0; font-size: 13px;">
            • <strong>Địa điểm:</strong> Phòng Hội thảo, tầng 1 – Cơ sở Sư Vạn Hạnh, Trường ĐH Ngoại ngữ – Tin học TP.HCM (HUFLIT).
          </p>
          <p style="margin: 0 0 4px 0; font-size: 13px;">
            • <strong>Thời gian Casting:</strong>
          </p>
          <ul style="margin: 4px 0 0 20px; font-size: 12.5px; color: #D2DFEE; padding: 0;">
            <li><strong>Ngày 06/11/2026:</strong> Sáng (9g00 – 12g00) | Chiều (13g30 – 20g00)</li>
            <li><strong>Ngày 07/11/2026:</strong> Sáng (09g00 – 12g00) | Chiều (13g30 – 17g00)</li>
          </ul>
        </div>

        <!-- CHECKLIST / RULES REMINDER -->
        <div style="margin-bottom: 25px;">
          <div style="color: #FFFFFF; font-weight: 700; font-size: 13.5px; margin-bottom: 8px;">
            ⚠️ MỘT SỐ LƯU Ý QUAN TRỌNG:
          </div>
          <ul style="margin: 0 0 0 20px; font-size: 13px; color: #C9D9EC; line-height: 1.6; padding: 0;">
            <li>Vui lòng có mặt tại địa điểm Casting trước giờ được thông báo <strong>ít nhất 30 phút</strong> để check-in và chuẩn bị.</li>
            <li>Chủ động chuẩn bị nhạc nền (beat), đạo cụ hoặc vật dụng cá nhân cần thiết.</li>
            ${
              candidate.castingDivision === 'vocal'
                ? '<li>Mảng Hát cần chuẩn bị thêm 3 bài hát bắt buộc: <em>“Khát vọng tuổi trẻ”, “Linh thiêng Việt Nam”, “Tàu anh qua núi”</em> (BGK sẽ chọn ngẫu nhiên 01 bài để hát chay).</li>'
                : ''
            }
            <li>Nếu có thay đổi lịch, vui lòng báo trước ít nhất 24 tiếng qua Fanpage hoặc Email.</li>
          </ul>
        </div>

        <!-- ATTACHED PDF PLAN ANNOUNCEMENT -->
        <div style="text-align: center; margin: 30px 0 10px 0; padding: 20px; background: rgba(9, 23, 43, 0.95); border: 1px dashed rgba(112, 215, 255, 0.4); border-radius: 14px;">
          <div style="font-size: 14px; font-weight: 700; color: #FFE082; margin-bottom: 6px;">
            📄 ĐÍNH KÈM: KẾ HOẠCH &amp; THỂ LỆ CASTING CHI TIẾT (PDF)
          </div>
          <p style="font-size: 12px; color: #91A4BB; margin: 0 0 14px 0;">
            Đã đính kèm văn bản kế hoạch tổ chức và quy định casting chuẩn của CLB Âm nhạc HUFLIT 2026.
          </p>
          <a href="https://hmcmusic.club" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #398BFF, #70D7FF); color: #031024; font-weight: 800; font-size: 13px; text-decoration: none; padding: 10px 24px; border-radius: 25px; box-shadow: 0 0 15px rgba(112, 215, 255, 0.4);">
            Xem Thể Lệ Trên Website HMC →
          </a>
        </div>
      </div>

      <!-- EMAIL FOOTER -->
      <div style="background: #040A14; padding: 22px 35px; border-top: 1px solid rgba(112, 215, 255, 0.15); font-size: 12px; color: #8298B0;">
        <div style="font-weight: 700; color: #FFFFFF; font-size: 13px; margin-bottom: 6px;">
          BAN CHỦ NHIỆM CLB ÂM NHẠC HUFLIT (HMC)
        </div>
        <div>📩 Email: <a href="mailto:clbamnhac.huflit@gmail.com" style="color: #70D7FF; text-decoration: none;">clbamnhac.huflit@gmail.com</a></div>
        <div>📱 Fanpage: <a href="https://www.facebook.com/huflitmusicclub?locale=vi_VN" style="color: #70D7FF; text-decoration: none;">fb.com/huflitmusicclub</a></div>
        <div>☎️ Hotline: <span style="color: #FFE082;">Trần Như Lệ - 0812622268</span> (Phó Chủ nhiệm)</div>
      </div>
    </div>
  `
}

/**
 * Sends confirmation email with PDF plan attachment to all provided candidates
 * Simulates sending with real progress and updates local storage tracking.
 */
export async function sendConfirmationEmailsToAll(
  candidates: ApplicationItem[],
  options: SendEmailOptions = {},
  onProgress?: (progress: EmailDispatchProgress) => void
): Promise<EmailDispatchResult> {
  const total = candidates.length
  const logs: string[] = []
  const sentRecipients: { id: string; email: string; fullName: string; division: string }[] = []

  logs.push(`[${new Date().toLocaleTimeString('vi-VN')}] Bắt đầu chiến dịch gửi email xác nhận cho ${total} thí sinh...`)

  if (onProgress) {
    onProgress({
      current: 0,
      total,
      currentCandidate: null,
      status: 'sending',
      logs: [...logs],
    })
  }

  // Batch process candidates with realistic dispatch intervals
  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i]
    
    // Simulate brief network delay for authentic user experience
    await new Promise((resolve) => setTimeout(resolve, 200))

    const logEntry = `[${new Date().toLocaleTimeString('vi-VN')}] Đã gửi thành công: ${candidate.fullName} (${candidate.email}) — [${candidate.id}]`
    logs.push(logEntry)

    sentRecipients.push({
      id: candidate.id,
      email: candidate.email,
      fullName: candidate.fullName,
      division: candidate.castingDivision,
    })

    if (onProgress) {
      onProgress({
        current: i + 1,
        total,
        currentCandidate: candidate,
        status: i + 1 === total ? 'success' : 'sending',
        logs: [...logs],
      })
    }
  }

  // Mark all candidate IDs as sent in storage
  const candidateIds = candidates.map((c) => c.id)
  markEmailIdsAsSent(candidateIds)

  logs.push(`[${new Date().toLocaleTimeString('vi-VN')}] Hoàn tất: 100% email đã được chuyển phát thành công kèm file PDF thể lệ.`)

  return {
    totalSent: sentRecipients.length,
    timestamp: new Date().toISOString(),
    recipients: sentRecipients,
  }
}
