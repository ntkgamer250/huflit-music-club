import { ApplicationItem, ApplicationQueryParams, ApplicationsResponse, CastingStatus, AdminUser } from './adminApi'
import { RecruitmentFormData } from './recruitmentService'

const STORAGE_KEY = 'hmc_recruitment_store_v1'
const SESSION_KEY = 'hmc_client_admin_session'

export const INITIAL_SAMPLE_APPLICATIONS: ApplicationItem[] = [
  {
    id: 'HMC-2026-001',
    fullName: 'Nguyễn Hoàng Minh',
    email: 'minh.nguyen@student.edu.vn',
    studentId: '23DH101234',
    castingDivision: 'vocal',
    castingSong: 'Linh thiêng Việt Nam',
    beatUrl: 'https://drive.google.com/file/d/1A2B3C4D_sample_beat/view',
    hasPerformanceExperience: true,
    performanceUrl: 'https://youtube.com/watch?v=sample_minh_live',
    passion: 'Mình đam mê ca hát từ nhỏ và có 2 năm sinh hoạt văn nghệ tại trường THPT. Mình mong muốn được học hỏi thêm về kỹ thuật bè, hòa thanh và tỏa sáng trên các sân khấu lớn cùng đại gia đình HMC.',
    status: 'shortlisted',
    adminNote: 'Giọng nam trầm ấm, phát âm rõ chữ, rất tự tin trên sân khấu. Ưu tiên xếp lịch casting ca 1.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'HMC-2026-002',
    fullName: 'Trần Thảo Linh',
    email: 'linh.tt@student.edu.vn',
    studentId: '23DH202345',
    castingDivision: 'vocal',
    castingSong: 'Tàu anh qua núi',
    beatUrl: 'https://soundcloud.com/sample_tau_anh_qua_nui',
    hasPerformanceExperience: true,
    performanceUrl: 'https://tiktok.com/@linh_vocals/video/123456789',
    passion: 'Âm nhạc là hơi thở của mình. Mình yêu thích các dòng nhạc truyền thống cách mạng kết hợp pop đương đại. Mong muốn mang giọng ca của mình hòa cùng dàn vocal đầy nhiệt huyết của HMC.',
    status: 'reviewing',
    adminNote: 'Cao độ tốt, xử lý nốt cao mượt mà. Cần kiểm tra kỹ năng đọc xướng âm.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'HMC-2026-003',
    fullName: 'Lê Quốc Bảo',
    email: 'bao.le@student.edu.vn',
    studentId: '24DH303456',
    castingDivision: 'dancer',
    castingSong: 'Supernova – aespa',
    beatUrl: 'https://drive.google.com/file/d/sample_dancer_track_1/view',
    hasPerformanceExperience: true,
    performanceUrl: 'https://facebook.com/watch/?v=sample_dance_clip',
    passion: 'Mình chuyên về Urban Dance và Hiphop Choreography. Tham gia HMC là ước mơ ngay từ khi bước chân vào giảng đường đại học để cùng cháy hết mình trong các đêm diễn của trường.',
    status: 'accepted',
    adminNote: 'Kỹ thuật popping và bắt beat rất chuẩn. Năng lượng làm chủ sân khấu tuyệt vời.',
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'HMC-2026-004',
    fullName: 'Phạm Quỳnh Như',
    email: 'quynhnhu.pham@student.edu.vn',
    studentId: '24DH404567',
    castingDivision: 'dancer',
    castingSong: 'Mantra – Jennie',
    beatUrl: 'https://youtube.com/watch?v=sample_dance_track_2',
    hasPerformanceExperience: false,
    performanceUrl: '',
    passion: 'Em tự học nhảy qua các video K-Pop và dance cover. Tuy chưa có kinh nghiệm diễn sân khấu lớn nhưng em rất kiên trì, học vũ đạo nhanh và luôn sẵn sàng luyện tập cùng đội ngũ HMC.',
    status: 'new',
    adminNote: '',
    createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'HMC-2026-005',
    fullName: 'Vũ Đức Thịnh',
    email: 'thinh.vu@student.edu.vn',
    studentId: '22DH505678',
    castingDivision: 'vocal',
    castingSong: 'Khát vọng tuổi trẻ',
    beatUrl: 'https://drive.google.com/file/d/sample_khat_vong/view',
    hasPerformanceExperience: false,
    performanceUrl: '',
    passion: 'Mình yêu ca hát và muốn thử thách bản thân ở môi trường câu lạc bộ chuyên nghiệp. HMC là nơi tràn đầy năng lượng và tình cảm anh em mà mình luôn tìm kiếm.',
    status: 'new',
    adminNote: '',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'HMC-2026-006',
    fullName: 'Đặng Mai Phương',
    email: 'phuong.dang@student.edu.vn',
    studentId: '23DH606789',
    castingDivision: 'vocal',
    castingSong: 'Đất phương Nam',
    beatUrl: 'https://drive.google.com/file/d/sample_dat_phuong_nam/view',
    hasPerformanceExperience: true,
    performanceUrl: 'https://youtube.com/watch?v=sample_phuong_dan_ca',
    passion: 'Âm hưởng dân gian đương đại luôn là niềm đam mê lớn nhất của mình. Hy vọng có cơ hội cống hiến màu giọng đặc trưng này cho các tiết mục đặc sắc của CLB.',
    status: 'shortlisted',
    adminNote: 'Màu giọng dân ca ngọt ngào, cảm xúc rất sâu lắng.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
]

export function getClientApplications(): ApplicationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_APPLICATIONS))
      return INITIAL_SAMPLE_APPLICATIONS
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_APPLICATIONS))
      return INITIAL_SAMPLE_APPLICATIONS
    }
    return parsed
  } catch {
    return INITIAL_SAMPLE_APPLICATIONS
  }
}

export function saveClientApplications(apps: ApplicationItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps))
  } catch (err) {
    console.error('Failed to save to localStorage:', err)
  }
}

export function addClientApplication(data: RecruitmentFormData): ApplicationItem {
  const apps = getClientApplications()
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
  const id = `HMC-2026-${Date.now().toString(36).toUpperCase().slice(-4)}-${randomSuffix}`
  const now = new Date().toISOString()

  const newApp: ApplicationItem = {
    id,
    fullName: data.fullName.trim(),
    email: data.email.trim(),
    studentId: data.studentId.trim().toUpperCase(),
    castingDivision: (data.castingDivision || 'vocal') as 'vocal' | 'dancer',
    castingSong: data.castingSong.trim(),
    beatUrl: data.beatUrl.trim(),
    hasPerformanceExperience: Boolean(data.hasPerformanceExperience),
    performanceUrl: (data.performanceUrl || '').trim(),
    passion: data.passion.trim(),
    status: 'new',
    adminNote: '',
    createdAt: now,
    updatedAt: now,
  }

  apps.unshift(newApp)
  saveClientApplications(apps)
  return newApp
}

export function updateClientApplication(
  id: string,
  payload: { status?: CastingStatus; adminNote?: string }
): ApplicationItem {
  const apps = getClientApplications()
  const index = apps.findIndex((a) => a.id === id)
  if (index === -1) {
    throw new Error('Không tìm thấy hồ sơ.')
  }

  const existing = apps[index]
  const updated: ApplicationItem = {
    ...existing,
    status: payload.status !== undefined ? payload.status : existing.status,
    adminNote: payload.adminNote !== undefined ? payload.adminNote : existing.adminNote,
    updatedAt: new Date().toISOString(),
  }

  apps[index] = updated
  saveClientApplications(apps)
  return updated
}

export function queryClientApplications(params: ApplicationQueryParams = {}): ApplicationsResponse {
  const allApps = getClientApplications()

  // Calculate global summary counts
  const counts = {
    total: allApps.length,
    vocal: allApps.filter((a) => a.castingDivision === 'vocal').length,
    dancer: allApps.filter((a) => a.castingDivision === 'dancer').length,
    new: allApps.filter((a) => a.status === 'new').length,
    reviewing: allApps.filter((a) => a.status === 'reviewing').length,
    shortlisted: allApps.filter((a) => a.status === 'shortlisted').length,
    rejected: allApps.filter((a) => a.status === 'rejected').length,
    accepted: allApps.filter((a) => a.status === 'accepted').length,
  }

  let filtered = [...allApps]

  // 1. Search Query
  if (params.q) {
    const q = params.q.toLowerCase().trim()
    filtered = filtered.filter(
      (a) =>
        a.fullName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.studentId.toLowerCase().includes(q) ||
        a.castingSong.toLowerCase().includes(q) ||
        a.passion.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
    )
  }

  // 2. Division Filter
  if (params.division && params.division !== 'all') {
    filtered = filtered.filter((a) => a.castingDivision === params.division)
  }

  // 3. Status Filter
  if (params.status && params.status !== 'all') {
    filtered = filtered.filter((a) => a.status === params.status)
  }

  // 4. Experience Filter
  if (params.experience && params.experience !== 'all') {
    const hasExp = params.experience === 'yes'
    filtered = filtered.filter((a) => a.hasPerformanceExperience === hasExp)
  }

  // 5. Sorting
  const sort = params.sort || 'created_desc'
  filtered.sort((a, b) => {
    switch (sort) {
      case 'created_asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'name_asc':
        return a.fullName.localeCompare(b.fullName, 'vi')
      case 'name_desc':
        return b.fullName.localeCompare(a.fullName, 'vi')
      case 'status':
        return a.status.localeCompare(b.status)
      case 'created_desc':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  // 6. Pagination
  const page = Math.max(1, params.page || 1)
  const limit = Math.max(1, params.limit || 10)
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const startIndex = (page - 1) * limit
  const paginated = filtered.slice(startIndex, startIndex + limit)

  return {
    applications: paginated,
    total,
    page,
    limit,
    totalPages,
    counts,
  }
}

export function exportClientCsv(params: ApplicationQueryParams = {}): void {
  const result = queryClientApplications({ ...params, page: 1, limit: 10000 })
  const apps = result.applications

  const headers = [
    'STT',
    'Mã hồ sơ',
    'Họ và tên',
    'MSSV',
    'Email',
    'Mảng casting',
    'Bài hát casting',
    'Link beat',
    'Kinh nghiệm',
    'Link trình diễn',
    'Trạng thái',
    'Ngày đăng ký',
    'Ghi chú admin',
  ]

  const rows = apps.map((app, index) => [
    index + 1,
    `"${app.id}"`,
    `"${app.fullName.replace(/"/g, '""')}"`,
    `"${app.studentId}"`,
    `"${app.email}"`,
    `"${app.castingDivision === 'vocal' ? 'Vocal Casting' : 'Dancer Casting'}"`,
    `"${app.castingSong.replace(/"/g, '""')}"`,
    `"${app.beatUrl.replace(/"/g, '""')}"`,
    `"${app.hasPerformanceExperience ? 'Có kinh nghiệm' : 'Chưa có'}"`,
    `"${(app.performanceUrl || '').replace(/"/g, '""')}"`,
    `"${app.status.toUpperCase()}"`,
    `"${new Date(app.createdAt).toLocaleString('vi-VN')}"`,
    `"${(app.adminNote || '').replace(/"/g, '""')}"`,
  ])

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `HMC_Recruitment_List_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Client Admin Authentication Helpers
export function clientLogin(email: string, password: string): { success: boolean; user?: AdminUser; error?: string } {
  const normalizedEmail = email.trim().toLowerCase()
  const cleanPassword = password.trim()

  // Accepted admin credentials on Netlify/Static hosting
  const isValidAdmin =
    (normalizedEmail === 'admin@hmcmusic.club' && cleanPassword === 'HmcAdmin@2026') ||
    (normalizedEmail === 'clbamnhac.huflit@gmail.com' && (cleanPassword === 'HmcAdmin@2026' || cleanPassword === '123456')) ||
    (normalizedEmail === 'admin' && (cleanPassword === '123456' || cleanPassword === 'HmcAdmin@2026')) ||
    (normalizedEmail.includes('admin') && (cleanPassword === 'HmcAdmin@2026' || cleanPassword === '123456'))

  if (!isValidAdmin) {
    return {
      success: false,
      error: 'Tài khoản hoặc mật khẩu không chính xác. Gợi ý: admin@hmcmusic.club / HmcAdmin@2026',
    }
  }

  const user: AdminUser = {
    id: 'admin_hmc_01',
    email: normalizedEmail.includes('@') ? normalizedEmail : 'admin@hmcmusic.club',
  }

  const token = `hmc_token_${Date.now()}_${Math.random().toString(36).substring(2)}`
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ user, token, loggedAt: Date.now() }))
  } catch (err) {
    console.error('Failed to save session:', err)
  }

  return { success: true, user }
}

export function getClientSession(): AdminUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.user || null
  } catch {
    return null
  }
}

export function clearClientSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    // ignore
  }
}
