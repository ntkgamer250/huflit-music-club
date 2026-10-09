import { ApplicationItem } from './adminApi'

/**
 * Extracts Vietnamese given name (the last word in full name)
 * E.g. "Nguyễn Hoàng Minh" -> "Minh"
 */
export function getVietnameseGivenName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/)
  return parts[parts.length - 1] || ''
}

/**
 * Compares two Vietnamese full names alphabetically:
 * 1. Compare by given name (last word) using Vietnamese collation
 * 2. If given names are identical, compare the entire full name
 */
export function compareVietnameseNames(a: string, b: string): number {
  const nameA = getVietnameseGivenName(a)
  const nameB = getVietnameseGivenName(b)
  const nameCmp = nameA.localeCompare(nameB, 'vi', { sensitivity: 'base' })
  if (nameCmp !== 0) return nameCmp
  return a.localeCompare(b, 'vi', { sensitivity: 'base' })
}

/**
 * Sorts an array of candidates alphabetically by Vietnamese name within each division
 * Division order: Vocal -> Dancer -> Traditional Dance
 */
export function sortCandidatesByDivisionAndName(candidates: ApplicationItem[]): {
  vocal: ApplicationItem[]
  dancer: ApplicationItem[]
  traditional_dance: ApplicationItem[]
  allSorted: ApplicationItem[]
} {
  const vocal = candidates
    .filter((c) => c.castingDivision === 'vocal')
    .sort((a, b) => compareVietnameseNames(a.fullName, b.fullName))

  const dancer = candidates
    .filter((c) => c.castingDivision === 'dancer')
    .sort((a, b) => compareVietnameseNames(a.fullName, b.fullName))

  const traditional_dance = candidates
    .filter((c) => c.castingDivision === 'traditional_dance')
    .sort((a, b) => compareVietnameseNames(a.fullName, b.fullName))

  return {
    vocal,
    dancer,
    traditional_dance,
    allSorted: [...vocal, ...dancer, ...traditional_dance],
  }
}

export interface ScoreSheetExportOptions {
  division?: 'all' | 'vocal' | 'dancer' | 'traditional_dance'
  includeCriteria?: boolean
  judgeName?: string
  roomName?: string
  auditionDate?: string
}

/**
 * Generates and opens a high-quality printable PDF Score Sheet for Audition Judges
 * with 8 ruled comment lines per candidate, grouped by division and sorted alphabetically A-Z.
 */
export function exportScoreSheetPdf(
  candidates: ApplicationItem[],
  options: ScoreSheetExportOptions = {}
): void {
  const {
    division = 'all',
    judgeName = '',
    roomName = 'Phòng Hội thảo, tầng 1 – CS Sư Vạn Hạnh, HUFLIT',
    auditionDate = '06/11 & 07/11/2026',
  } = options

  const sortedGroups = sortCandidatesByDivisionAndName(candidates)

  const activeGroups: { title: string; divisionKey: string; list: ApplicationItem[] }[] = []

  if (division === 'all' || division === 'vocal') {
    if (sortedGroups.vocal.length > 0) {
      activeGroups.push({
        title: 'MẢNG HÁT (VOCAL) — DANH SÁCH SẮP XẾP TỪ A ĐẾN Z',
        divisionKey: 'vocal',
        list: sortedGroups.vocal,
      })
    }
  }

  if (division === 'all' || division === 'dancer') {
    if (sortedGroups.dancer.length > 0) {
      activeGroups.push({
        title: 'MẢNG NHẢY (DANCE) — DANH SÁCH SẮP XẾP TỪ A ĐẾN Z',
        divisionKey: 'dancer',
        list: sortedGroups.dancer,
      })
    }
  }

  if (division === 'all' || division === 'traditional_dance') {
    if (sortedGroups.traditional_dance.length > 0) {
      activeGroups.push({
        title: 'MẢNG MÚA (TRADITIONAL / CONTEMPORARY) — DANH SÁCH SẮP XẾP TỪ A ĐẾN Z',
        divisionKey: 'traditional_dance',
        list: sortedGroups.traditional_dance,
      })
    }
  }

  if (activeGroups.length === 0) {
    alert('Không có thí sinh nào trong danh sách để xuất phiếu chấm điểm.')
    return
  }

  // Open print preview window
  const printWindow = window.open('', '_blank', 'width=1000,height=900')
  if (!printWindow) {
    alert('Trình duyệt đang chặn cửa sổ pop-up. Vui lòng cho phép mở pop-up để xem và in phiếu chấm điểm PDF.')
    return
  }

  const renderCandidateCard = (c: ApplicationItem, index: number, totalInDiv: number) => {
    return `
      <div class="candidate-card">
        <!-- Top Info Header -->
        <div class="card-header">
          <div class="candidate-meta">
            <span class="stt-badge">STT: ${index + 1 < 10 ? '0' + (index + 1) : index + 1}/${totalInDiv < 10 ? '0' + totalInDiv : totalInDiv}</span>
            <span class="candidate-name">${c.fullName.toUpperCase()}</span>
            <span class="candidate-mssv">MSSV: <strong>${c.studentId}</strong></span>
            <span class="candidate-code">Mã HS: ${c.id}</span>
          </div>
          <div class="candidate-quick-eval">
            <span class="checkbox-box">[ &nbsp; ] ĐẠT</span>
            <span class="checkbox-box">[ &nbsp; ] DỰ BỊ</span>
            <span class="checkbox-box">[ &nbsp; ] LOẠI</span>
          </div>
        </div>

        <!-- Audition Detail Bar -->
        <div class="audition-info-bar">
          <div class="info-item">
            <span class="label">Bài/Tác phẩm casting:</span>
            <span class="value font-bold">${c.castingSong || '(Chưa điền)'}</span>
          </div>
          <div class="info-item">
            <span class="label">Kinh nghiệm biểu diễn:</span>
            <span class="value">${c.hasPerformanceExperience ? 'Đã từng diễn bên ngoài' : 'Chưa có'}</span>
          </div>
          <div class="info-item">
            <span class="label">Email liên hệ:</span>
            <span class="value">${c.email}</span>
          </div>
        </div>

        <!-- Scoring Criteria Table -->
        <table class="scoring-table">
          <thead>
            <tr>
              <th style="width: 25%;">Kỹ thuật / Giọng / Vũ đạo (Thang 10)</th>
              <th style="width: 25%;">Tiết tấu & Nhịp phách (Thang 10)</th>
              <th style="width: 25%;">Thần thái & Cảm xúc (Thang 10)</th>
              <th style="width: 25%;">TỔNG ĐIỂM (Thang 30)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="score-cell">&nbsp;</td>
              <td class="score-cell">&nbsp;</td>
              <td class="score-cell">&nbsp;</td>
              <td class="score-cell total-cell">&nbsp;</td>
            </tr>
          </tbody>
        </table>

        <!-- 8-Line Ruled Feedback Area -->
        <div class="comments-section">
          <div class="comments-title">NHẬN XÉT CỦA BAN GIÁM KHẢO (ĐÁNH GIÁ CHI TIẾT &amp; ĐỀ XUẤT XẾP BAN/CA BIỂU DIỄN):</div>
          <div class="ruled-lines">
            <div class="rule-line"><span class="line-num">1</span></div>
            <div class="rule-line"><span class="line-num">2</span></div>
            <div class="rule-line"><span class="line-num">3</span></div>
            <div class="rule-line"><span class="line-num">4</span></div>
            <div class="rule-line"><span class="line-num">5</span></div>
            <div class="rule-line"><span class="line-num">6</span></div>
            <div class="rule-line"><span class="line-num">7</span></div>
            <div class="rule-line"><span class="line-num">8</span></div>
          </div>
        </div>
      </div>
    `
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8" />
      <title>HMC_Bang_Cham_Diem_Casting_2026</title>
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Times New Roman', Times, serif;
          color: #000;
          background: #fff;
          font-size: 13px;
          line-height: 1.35;
          padding: 10mm;
        }

        .no-print-toolbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #071a33;
          color: #fff;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 9999;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          font-family: system-ui, -apple-system, sans-serif;
        }

        .no-print-toolbar button {
          background: #398bff;
          color: #fff;
          border: none;
          padding: 8px 18px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
        }

        .no-print-toolbar button:hover {
          background: #2563eb;
        }

        .print-container {
          max-width: 820px;
          margin: 45px auto 0 auto;
        }

        /* HEADER */
        .doc-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #000;
          padding-bottom: 8px;
          margin-bottom: 12px;
        }

        .header-left {
          text-align: center;
          width: 48%;
        }

        .header-left .school {
          font-size: 11px;
          text-transform: uppercase;
        }

        .header-left .org {
          font-size: 11.5px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .header-left .divider {
          width: 80px;
          height: 1px;
          background: #000;
          margin: 3px auto;
        }

        .header-right {
          text-align: center;
          width: 48%;
        }

        .header-right .club-title {
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          color: #000;
        }

        .header-right .event-title {
          font-size: 11px;
          font-style: italic;
        }

        .doc-title-block {
          text-align: center;
          margin: 14px 0 10px 0;
        }

        .doc-title {
          font-size: 18px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .doc-subtitle {
          font-size: 12px;
          font-style: italic;
          margin-top: 2px;
        }

        .meta-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 20px;
          margin-bottom: 15px;
          font-size: 12.5px;
          border: 1px dashed #666;
          padding: 8px 12px;
          border-radius: 4px;
        }

        /* DIVISION SECTION */
        .division-section {
          margin-bottom: 25px;
          page-break-after: auto;
        }

        .division-heading {
          background: #0a1f44;
          color: #fff;
          padding: 6px 12px;
          font-size: 13.5px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
          border-radius: 3px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* CANDIDATE CARD */
        .candidate-card {
          border: 1.5px solid #222;
          border-radius: 6px;
          padding: 10px 12px;
          margin-bottom: 18px;
          background: #fff;
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #333;
          padding-bottom: 5px;
          margin-bottom: 6px;
        }

        .candidate-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .stt-badge {
          background: #000;
          color: #fff;
          font-weight: bold;
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: Arial, sans-serif;
        }

        .candidate-name {
          font-size: 15px;
          font-weight: bold;
          color: #000;
        }

        .candidate-mssv {
          font-size: 12.5px;
        }

        .candidate-code {
          font-size: 10.5px;
          color: #555;
          font-family: monospace;
        }

        .candidate-quick-eval {
          display: flex;
          gap: 8px;
          font-size: 11.5px;
          font-weight: bold;
        }

        .checkbox-box {
          border: 1px solid #333;
          padding: 2px 6px;
          border-radius: 3px;
          background: #f9f9f9;
        }

        .audition-info-bar {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 8px;
          font-size: 11.5px;
          background: #f4f7fb;
          padding: 5px 8px;
          border-radius: 4px;
          border: 1px solid #ddd;
          margin-bottom: 8px;
        }

        .info-item .label {
          color: #444;
          font-size: 10.5px;
          display: block;
        }

        .info-item .value {
          color: #000;
        }

        .font-bold {
          font-weight: bold;
        }

        /* SCORING TABLE */
        .scoring-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 8px;
          font-size: 11px;
          text-align: center;
        }

        .scoring-table th, .scoring-table td {
          border: 1px solid #444;
          padding: 4px 6px;
        }

        .scoring-table th {
          background: #eef2f7;
          font-weight: bold;
          font-size: 10.5px;
        }

        .score-cell {
          height: 24px;
        }

        .total-cell {
          font-weight: bold;
          background: #fafafa;
        }

        /* 8-LINE RULED FEEDBACK */
        .comments-section {
          margin-top: 4px;
        }

        .comments-title {
          font-size: 11px;
          font-weight: bold;
          color: #111;
          margin-bottom: 4px;
          text-transform: uppercase;
        }

        .ruled-lines {
          border: 1px solid #999;
          background: #fff;
          border-radius: 3px;
        }

        .rule-line {
          height: 22px;
          border-bottom: 1px dotted #888;
          display: flex;
          align-items: center;
          padding-left: 6px;
        }

        .rule-line:last-child {
          border-bottom: none;
        }

        .line-num {
          font-size: 9px;
          color: #aaa;
          user-select: none;
          width: 14px;
        }

        /* JUDGE SIGNATURE FOOTER */
        .doc-footer {
          margin-top: 30px;
          display: flex;
          justify-content: space-between;
          page-break-inside: avoid;
        }

        .signature-box {
          text-align: center;
          width: 40%;
        }

        .signature-box .role {
          font-weight: bold;
          font-size: 12.5px;
          text-transform: uppercase;
        }

        .signature-box .date {
          font-size: 11.5px;
          font-style: italic;
          margin-bottom: 50px;
        }

        .signature-box .name {
          font-weight: bold;
          border-top: 1px dotted #888;
          padding-top: 4px;
          display: inline-block;
          min-width: 160px;
        }

        @media print {
          .no-print-toolbar {
            display: none !important;
          }

          body {
            padding: 0 !important;
          }

          .print-container {
            margin: 0 !important;
            max-width: 100% !important;
          }

          .candidate-card {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .division-heading {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          @page {
            size: A4 portrait;
            margin: 12mm 10mm;
          }
        }
      </style>
    </head>
    <body>
      <div class="no-print-toolbar">
        <div>
          <strong>BẢNG CHẤM ĐIỂM CASTING CLB ÂM NHẠC HUFLIT (HMC 2026)</strong>
          <span style="font-size: 12px; opacity: 0.8; margin-left: 10px;">— Sắp xếp A → Z theo từng mảng</span>
        </div>
        <div style="display: flex; gap: 10px;">
          <button onclick="window.print()">🖨️ In hoặc Lưu file PDF</button>
          <button onclick="window.close()" style="background: rgba(255,255,255,0.15);">Đóng</button>
        </div>
      </div>

      <div class="print-container">
        <!-- HEADER -->
        <div class="doc-header">
          <div class="header-left">
            <div class="school">TRƯỜNG ĐẠI HỌC NGOẠI NGỮ – TIN HỌC TP.HCM</div>
            <div class="org">ĐOÀN THANH NIÊN – HỘI SINH VIÊN</div>
            <div class="divider"></div>
          </div>
          <div class="header-right">
            <div class="club-title">CÂU LẠC BỘ ÂM NHẠC (HUFLIT MUSIC CLUB)</div>
            <div class="event-title">ĐỢT TUYỂN CỘNG TÁC VIÊN – NĂM 2026</div>
          </div>
        </div>

        <!-- TITLE BLOCK -->
        <div class="doc-title-block">
          <div class="doc-title">PHIẾU ĐÁNH GIÁ &amp; CHẤM ĐIỂM CASTING</div>
          <div class="doc-subtitle">(Danh sách thí sinh được tự động sắp xếp theo bảng chữ cái A → Z theo từng lĩnh vực)</div>
        </div>

        <!-- META INFO -->
        <div class="meta-info-grid">
          <div><strong>Ban Giám Khảo:</strong> ${judgeName ? judgeName : '....................................................................'}</div>
          <div><strong>Thời gian Casting:</strong> ${auditionDate}</div>
          <div><strong>Địa điểm:</strong> ${roomName}</div>
          <div><strong>Tổng số thí sinh:</strong> ${candidates.length} thí sinh</div>
        </div>

        <!-- DIVISIONS -->
        ${activeGroups
          .map(
            (group) => `
            <div class="division-section">
              <div class="division-heading">
                <span>${group.title}</span>
                <span style="font-size: 11px; font-weight: normal; opacity: 0.9;">Tổng: ${group.list.length} thí sinh</span>
              </div>

              ${group.list
                .map((c, idx) => renderCandidateCard(c, idx, group.list.length))
                .join('')}
            </div>
          `
          )
          .join('')}

        <!-- SIGNATURES -->
        <div class="doc-footer">
          <div class="signature-box">
            <div class="role">THƯ KÝ BAN TỔ CHỨC</div>
            <div class="date">(Ký và ghi rõ họ tên)</div>
            <div class="name">...................................................</div>
          </div>

          <div class="signature-box">
            <div class="role">BAN GIÁM KHẢO CHẤM THI</div>
            <div class="date">Ngày ..... tháng 11 năm 2026</div>
            <div class="name">${judgeName ? judgeName : '...................................................'}</div>
          </div>
        </div>
      </div>

      <script>
        // Auto trigger print prompt after rendering
        window.addEventListener('load', () => {
          setTimeout(() => {
            window.print();
          }, 300);
        });
      </script>
    </body>
    </html>
  `

  printWindow.document.open()
  printWindow.document.write(htmlContent)
  printWindow.document.close()
}
