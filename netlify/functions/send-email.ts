import type { Handler, HandlerEvent } from '@netlify/functions'

interface SendEmailPayload {
  provider?: 'resend' | 'emailjs' | 'webhook'
  apiKey?: string
  from?: string
  to?: string | string[]
  subject?: string
  html?: string
  customNote?: string
}

export const handler: Handler = async (event: HandlerEvent) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Chỉ chấp nhận phương thức POST.' }),
    }
  }

  try {
    const body: SendEmailPayload = JSON.parse(event.body || '{}')
    const apiKey = (body.apiKey || process.env.RESEND_API_KEY || '').trim()
    const rawTo = body.to
    const recipients = Array.isArray(rawTo) ? rawTo : [rawTo || '']
    const cleanRecipients = recipients.map((r) => String(r).trim()).filter(Boolean)

    if (cleanRecipients.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Thiếu địa chỉ email người nhận (to).' }),
      }
    }

    if (!apiKey) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Chưa có Resend API Key. Vui lòng nhập API Key bắt đầu bằng re_...',
        }),
      }
    }

    // Determine sender address
    // Resend requires verified domain or onboarding@resend.dev on free tier
    let sender = body.from?.trim() || 'CLB Âm nhạc HUFLIT <onboarding@resend.dev>'
    if (sender.includes('@gmail.com') || sender.includes('@yahoo.com') || sender.includes('@outlook.com')) {
      // Resend does not allow free webmail addresses as From header without verified domain
      sender = 'CLB Âm nhạc HUFLIT <onboarding@resend.dev>'
    }

    // Call Resend API server-to-server (No CORS issues)
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: sender,
        to: cleanRecipients,
        subject: body.subject || '[HMC 2026] Xác nhận đăng ký Casting CTV - CLB Âm nhạc HUFLIT',
        html: body.html || '<p>Xác nhận đăng ký casting HMC 2026</p>',
      }),
    })

    const resendData = await resendResponse.json()

    if (!resendResponse.ok) {
      let errorMessage = resendData.message || `Resend trả về mã lỗi HTTP ${resendResponse.status}`
      if (resendData.name === 'validation_error' && resendData.message?.includes('testing emails')) {
        errorMessage =
          'Tài khoản Resend miễn phí (chưa gắn tên miền riêng) chỉ cho phép gửi email thử nghiệm đến chính email đăng ký Resend của bạn. Để gửi cho tất cả thí sinh (@student.edu.vn, @gmail.com), bạn nên dùng phương thức EmailJS (kết nối Gmail CLB) hoặc xác thực tên miền trên Resend.'
      }

      return {
        statusCode: resendResponse.status,
        headers,
        body: JSON.stringify({
          success: false,
          error: errorMessage,
          raw: resendData,
        }),
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        id: resendData.id,
        message: 'Đã chuyển phát email thành công qua Resend.',
      }),
    }
  } catch (err: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: err.message || 'Lỗi xử lý gửi email trên Netlify Function.',
      }),
    }
  }
}
