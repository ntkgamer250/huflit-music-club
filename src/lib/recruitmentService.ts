import { addClientApplication } from './clientStore'

export interface RecruitmentFormData {
  fullName: string
  email: string
  studentId: string
  castingDivision: 'vocal' | 'dancer' | 'traditional_dance' | null
  castingSong: string
  beatUrl: string
  hasPerformanceExperience: boolean | null
  performanceUrl?: string
  passion: string
}

export interface SubmissionResponse {
  success: boolean
  id: string
  submittedAt: string
  message: string
}

/**
 * Clean submit abstraction for HMC Collaborator Casting.
 * Works seamlessly on static deployments (Netlify) via client storage
 * and connects to REST API/backend servers when available.
 */
export async function submitApplication(
  data: RecruitmentFormData
): Promise<SubmissionResponse> {
  const now = new Date().toISOString()

  // 1. Try server endpoint first
  try {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const contentType = res.headers.get('content-type') || ''
    if (res.ok && contentType.includes('application/json')) {
      const result = await res.json()
      if (result.success) {
        try {
          addClientApplication(data)
        } catch {
          // ignore
        }
        return {
          success: true,
          id: result.id,
          submittedAt: now,
          message: result.message || 'Đơn đăng ký đã được ghi nhận thành công!',
        }
      }
    }
  } catch {
    // Static hosting fallback
  }

  // 2. Client-side storage fallback (Netlify)
  try {
    const newApp = addClientApplication(data)
    return {
      success: true,
      id: newApp.id,
      submittedAt: now,
      message: 'Đơn đăng ký của bạn đã được ghi nhận thành công!',
    }
  } catch (err: any) {
    console.error('Submission request failed:', err)
    throw new Error(err.message || 'Chưa thể gửi đơn. Vui lòng thử lại.')
  }
}

