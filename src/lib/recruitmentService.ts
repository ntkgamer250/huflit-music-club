export interface RecruitmentFormData {
  fullName: string
  email: string
  studentId: string
  castingDivision: 'vocal' | 'dancer' | null
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
 * Integrates smoothly with localStorage for local offline preservation
 * and can be connected to any backend / Firebase / REST API.
 */
export async function submitApplication(
  data: RecruitmentFormData
): Promise<SubmissionResponse> {
  const now = new Date().toISOString()

  try {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await res.json()

    if (!res.ok || !result.success) {
      throw new Error(result.error || 'Chưa thể gửi đơn. Vui lòng thử lại.')
    }

    // Also mirror to localStorage for offline cache
    try {
      const existing = JSON.parse(localStorage.getItem('hmc_recruitment_applications') || '[]')
      existing.push({ id: result.id, ...data, submittedAt: now })
      localStorage.setItem('hmc_recruitment_applications', JSON.stringify(existing))
    } catch {
      // ignore local cache error
    }

    return {
      success: true,
      id: result.id,
      submittedAt: now,
      message: result.message || 'Đơn đăng ký đã được ghi nhận thành công!',
    }
  } catch (err: any) {
    console.error('Submission request failed:', err)
    throw new Error(err.message || 'Chưa thể gửi đơn. Vui lòng thử lại.')
  }
}
