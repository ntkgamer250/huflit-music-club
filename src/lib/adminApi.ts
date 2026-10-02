export interface AdminUser {
  id: string
  email: string
}

export type CastingStatus = 'new' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted'

export interface ApplicationItem {
  id: string
  fullName: string
  email: string
  studentId: string
  castingDivision: 'vocal' | 'dancer'
  castingSong: string
  beatUrl: string
  hasPerformanceExperience: boolean
  performanceUrl: string
  passion: string
  status: CastingStatus
  adminNote: string
  createdAt: string
  updatedAt: string
}

export interface ApplicationCounts {
  total: number
  vocal: number
  dancer: number
  new: number
  reviewing: number
  shortlisted: number
  rejected: number
  accepted: number
}

export interface ApplicationsResponse {
  applications: ApplicationItem[]
  total: number
  page: number
  limit: number
  totalPages: number
  counts: ApplicationCounts
}

export interface ApplicationQueryParams {
  q?: string
  division?: string
  status?: string
  experience?: string
  sort?: string
  page?: number
  limit?: number
}

// Token helper for Authorization header fallback in addition to cookies
const TOKEN_KEY = 'hmc_admin_auth_token'

export function getSavedToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearSavedToken() {
  localStorage.removeItem(TOKEN_KEY)
}

function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  const token = getSavedToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Thông tin đăng nhập không chính xác.' }
    }
    if (data.token) {
      saveToken(data.token)
    }
    return { success: true, user: data.user }
  } catch (err: any) {
    return { success: false, error: 'Không thể kết nối đến máy chủ. Vui lòng thử lại.' }
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: getAuthHeaders(),
    })
  } catch {
    // ignore
  } finally {
    clearSavedToken()
  }
}

export async function checkAuth(): Promise<{ authenticated: boolean; user?: AdminUser }> {
  try {
    const res = await fetch('/api/auth/me', {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    if (!res.ok) return { authenticated: false }
    const data = await res.json()
    return data
  } catch {
    return { authenticated: false }
  }
}

export async function fetchApplications(params: ApplicationQueryParams = {}): Promise<ApplicationsResponse> {
  const searchParams = new URLSearchParams()
  if (params.q) searchParams.set('q', params.q)
  if (params.division && params.division !== 'all') searchParams.set('division', params.division)
  if (params.status && params.status !== 'all') searchParams.set('status', params.status)
  if (params.experience && params.experience !== 'all') searchParams.set('experience', params.experience)
  if (params.sort) searchParams.set('sort', params.sort)
  if (params.page) searchParams.set('page', String(params.page))
  if (params.limit) searchParams.set('limit', String(params.limit))

  const url = `/api/applications?${searchParams.toString()}`
  const res = await fetch(url, {
    headers: getAuthHeaders(),
  })

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('UNAUTHORIZED')
    }
    const errData = await res.json().catch(() => ({}))
    throw new Error(errData.error || 'Không thể tải danh sách đăng ký.')
  }

  return res.json()
}

export async function fetchApplicationById(id: string): Promise<ApplicationItem> {
  const res = await fetch(`/api/applications/${id}`, {
    headers: getAuthHeaders(),
  })

  if (!res.ok) {
    if (res.status === 401) throw new Error('UNAUTHORIZED')
    const errData = await res.json().catch(() => ({}))
    throw new Error(errData.error || 'Không tìm thấy hồ sơ.')
  }

  const data = await res.json()
  return data.application
}

export async function updateApplication(
  id: string,
  payload: { status?: CastingStatus; adminNote?: string }
): Promise<ApplicationItem> {
  const res = await fetch(`/api/applications/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    if (res.status === 401) throw new Error('UNAUTHORIZED')
    const errData = await res.json().catch(() => ({}))
    throw new Error(errData.error || 'Không thể cập nhật hồ sơ.')
  }

  const data = await res.json()
  return data.application
}

export function getExportCsvUrl(params: ApplicationQueryParams = {}): string {
  const searchParams = new URLSearchParams()
  if (params.q) searchParams.set('q', params.q)
  if (params.division && params.division !== 'all') searchParams.set('division', params.division)
  if (params.status && params.status !== 'all') searchParams.set('status', params.status)
  if (params.experience && params.experience !== 'all') searchParams.set('experience', params.experience)
  return `/api/applications/export/csv?${searchParams.toString()}`
}
