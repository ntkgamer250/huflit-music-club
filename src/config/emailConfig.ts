export interface EmailProviderConfig {
  provider: 'resend' | 'emailjs' | 'webhook' | 'simulation'
  // Resend
  resendApiKey?: string
  senderEmail?: string
  // EmailJS
  emailjsServiceId?: string
  emailjsTemplateId?: string
  emailjsPublicKey?: string
  // Webhook / Google Apps Script
  webhookUrl?: string
  // Tự động gửi email ngay khi thí sinh nộp hồ sơ đăng ký
  autoSendOnRegistration?: boolean
}

/**
 * CẤU HÌNH GỬI EMAIL CHO TOÀN BỘ WEBSITE CLB ÂM NHẠC HUFLIT (HMC)
 * 
 * Khi thí sinh bấm "Gửi Đơn Đăng Ký", hệ thống sẽ đọc cấu hình này để tự động
 * gửi email xác nhận cá nhân hóa kèm lịch casting và đường dẫn thể lệ đến hòm thư của thí sinh.
 * 
 * Hướng dẫn điền:
 * - Nếu dùng Resend: Đặt provider = 'resend' và dán mã resendApiKey (bắt đầu bằng re_...)
 * - Nếu dùng EmailJS: Đặt provider = 'emailjs' và dán emailjsServiceId, emailjsTemplateId, emailjsPublicKey
 * - Nếu dùng Google Apps Script: Đặt provider = 'webhook' và dán webhookUrl
 */
export const DEFAULT_EMAIL_CONFIG: EmailProviderConfig = {
  provider: 'resend',
  senderEmail: 'CLB Âm nhạc HUFLIT <onboarding@resend.dev>',
  resendApiKey: '', // Dán mã re_... vào đây để kích hoạt gửi tự động
  emailjsServiceId: '',
  emailjsTemplateId: '',
  emailjsPublicKey: '',
  webhookUrl: '',
  autoSendOnRegistration: true, // true: Tự động gửi mail ngay khi thí sinh đăng ký
}
