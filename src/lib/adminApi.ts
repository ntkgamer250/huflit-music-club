import {
  clientLogin,
  getClientSession,
  clearClientSession,
  getClientApplications,
  queryClientApplications,
  updateClientApplication,
  exportClientCsv,
} from './clientStore'

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

export async function loginAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  // 1. Try server endpoint first (e.g. during local dev or custom backend)
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const data = await res.json()
      if (res.ok && data.success) {
        if (data.token) {
          saveToken(data.token)
        }
        return { success: true, user: data.user }
      }
    }
  } catch {
    // server unreachable or static SPA host
  }

  // 2. Client-side fallback for static deployment (Netlify)
  const clientRes = clientLogin(email, password)
  if (clientRes.success && clientRes.user) {
    saveToken('client_session_' + Date.now())
    return clientRes
  }

  return {
    success: false,
    error: clientRes.error || 'Thông tin đăng nhập không chính xác. (Mặc định: admin@hmcmusic.club / HmcAdmin@2026)',
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
    clearClientSession()
  }
}

export async function checkAuth(): Promise<{ authenticated: boolean; user?: AdminUser }> {
  // 1. Check client session first (works immediately on Netlify)
  const clientUser = getClientSession()
  if (clientUser) {
    return { authenticated: true, user: clientUser }
  }

  // 2. Check server session if client session not set
  try {
    const res = await fetch('/api/auth/me', {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    const contentType = res.headers.get('content-type') || ''
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json()
      return data
    }
    return { authenticated: false }
  } catch {
    return { authenticated: false }
  }
}

export async function fetchApplications(params: ApplicationQueryParams = {}): Promise<ApplicationsResponse> {
  // 1. Try server endpoint first
  try {
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
    const contentType = res.headers.get('content-type') || ''

    if (res.ok && contentType.includes('application/json')) {
      return await res.json()
    }

    if (res.status === 401) {
      const clientUser = getClientSession()
      if (!clientUser) {
        throw new Error('UNAUTHORIZED')
      }
    }
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') throw err
  }

  // 2. Client-side store fallback for Netlify
  return queryClientApplications(params)
}

export async function fetchApplicationById(id: string): Promise<ApplicationItem> {
  try {
    const res = await fetch(`/api/applications/${id}`, {
      headers: getAuthHeaders(),
    })
    const contentType = res.headers.get('content-type') || ''
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json()
      return data.application
    }
  } catch {
    // fallback to client store
  }

  const apps = getClientApplications()
  const found = apps.find((a) => a.id === id)
  if (!found) throw new Error('Không tìm thấy hồ sơ.')
  return found
}

export async function updateApplication(
  id: string,
  payload: { status?: CastingStatus; adminNote?: string }
): Promise<ApplicationItem> {
  try {
    const res = await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    })
    const contentType = res.headers.get('content-type') || ''
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json()
      try {
        updateClientApplication(id, payload)
      } catch {
        // ignore
      }
      return data.application
    }
  } catch {
    // fallback
  }

  return updateClientApplication(id, payload)
}

export function getExportCsvUrl(params: ApplicationQueryParams = {}): string {
  const searchParams = new URLSearchParams()
  if (params.q) searchParams.set('q', params.q)
  if (params.division && params.division !== 'all') searchParams.set('division', params.division)
  if (params.status && params.status !== 'all') searchParams.set('status', params.status)
  if (params.experience && params.experience !== 'all') searchParams.set('experience', params.experience)
  return `/api/applications/export/csv?${searchParams.toString()}`
}

export { exportClientCsv }

