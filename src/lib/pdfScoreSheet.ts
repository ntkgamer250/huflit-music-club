import { ApplicationItem } from './adminApi'

/**
 * Parses full name into Given Name (Tên) and Family/Middle Name (Họ và Tên đệm).
 * E.g. "Nguyễn Tuấn Anh" -> { givenName: "Anh", familyMiddle: "Nguyễn Tuấn" }
 * E.g. "Nguyễn Bảo" -> { givenName: "Bảo", familyMiddle: "Nguyễn" }
 */
export function parseVietnameseName(fullName: string): { givenName: string; familyMiddle: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { givenName: '', familyMiddle: '' }
  if (parts.length === 1) return { givenName: parts[0], familyMiddle: '' }
  const givenName = parts[parts.length - 1]
  const familyMiddle = parts.slice(0, parts.length - 1).join(' ')
  return { givenName, familyMiddle }
}

/**
 * Extracts Vietnamese given name (the last word in full name)
 * E.g. "Nguyễn Hoàng Minh" -> "Minh"
 */
export function getVietnameseGivenName(fullName: string): string {
  return parseVietnameseName(fullName).givenName
}

/**
 * Compares two Vietnamese full names alphabetically:
 * 1. Compare by given name (last word) alphabetically using Vietnamese collation
 *    E.g. "Anh" (A) stands before "Bảo" (B) -> "Nguyễn Tuấn Anh" before "Nguyễn Bảo"
 * 2. If given names are identical, compare by family & middle names ("Họ và tên đệm")
 * 3. If still identical, compare the whole string
 */
export function compareVietnameseNames(a: string, b: string): number {
  const parsedA = parseVietnameseName(a)
  const parsedB = parseVietnameseName(b)

  // 1. So sánh Tên (Given Name) theo bảng chữ cái A-Z
  const cmpGiven = parsedA.givenName.localeCompare(parsedB.givenName, 'vi', { sensitivity: 'base' })
  if (cmpGiven !== 0) return cmpGiven

  // 2. Nếu Tên trùng nhau hoàn toàn, so sánh Họ và Tên đệm
  const cmpFamily = parsedA.familyMiddle.localeCompare(parsedB.familyMiddle, 'vi', { sensitivity: 'base' })
  if (cmpFamily !== 0) return cmpFamily

  // 3. Phân biệt chính xác từng dấu nếu có
  return a.localeCompare(b, 'vi')
}

/**
 * Sorts an array of candidates alphabetically by Vietnamese given name (A-Z) within each division
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
 * Generates and opens a high-quality, ultra-compact printable PDF Score Sheet for Audition Judges:
 * - 2-column table per division
 * - Left column: Candidate STT, Name + MSSV on single line, casting piece & experience (no email)
 * - Right column: Top-right evaluation checkboxes and exactly 3 ruled comment lines
 * - Removed signature block to maximize space 100% for candidate evaluation rows
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
        title: 'MẢNG HÁT (VOCAL) — DANH SÁCH SẮP XẾP THEO TÊN (A → Z)',
        divisionKey: 'vocal',
        list: sortedGroups.vocal,
      })
    }
  }

  if (division === 'all' || division === 'dancer') {
    if (sortedGroups.dancer.length > 0) {
      activeGroups.push({
        title: 'MẢNG NHẢY (DANCE) — DANH SÁCH SẮP XẾP THEO TÊN (A → Z)',
        divisionKey: 'dancer',
        list: sortedGroups.dancer,
      })
    }
  }

  if (division === 'all' || division === 'traditional_dance') {
    if (sortedGroups.traditional_dance.length > 0) {
      activeGroups.push({
        title: 'MẢNG MÚA (TRADITIONAL / CONTEMPORARY) — DANH SÁCH SẮP XẾP THEO TÊN (A → Z)',
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
  const printWindow = window.open('', '_blank', 'width=1050,height=900')
  if (!printWindow) {
    alert('Trình duyệt đang chặn cửa sổ pop-up. Vui lòng cho phép mở pop-up để xem và in phiếu chấm điểm PDF.')
    return
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8" />
      <title>HMC_Phieu_Danh_Gia_Cham_Diem_Casting_2026</title>
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
          font-size: 12.5px;
          line-height: 1.3;
          padding: 8mm;
        }

        .no-print-toolbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #071a33;
          color: #fff;
          padding: 10px 20px;
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
          padding: 7px 16px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 13.5px;
          cursor: pointer;
        }

        .no-print-toolbar button:hover {
          background: #2563eb;
        }

        .print-container {
          max-width: 920px;
          margin: 40px auto 0 auto;
        }

        /* HEADER */
        .doc-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #000;
          padding-bottom: 5px;
          margin-bottom: 8px;
        }

        .header-left {
          text-align: center;
          width: 48%;
        }

        .header-left .school {
          font-size: 10px;
          text-transform: uppercase;
        }

        .header-left .org {
          font-size: 10.5px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .header-left .divider {
          width: 70px;
          height: 1px;
          background: #000;
          margin: 2px auto;
        }

        .header-right {
          text-align: center;
          width: 48%;
        }

        .header-right .club-title {
          font-size: 11px;
          font-weight: bold;
          text-transform: uppercase;
          color: #000;
        }

        .header-right .event-title {
          font-size: 10px;
          font-style: italic;
        }

        .doc-title-block {
          text-align: center;
          margin: 8px 0 6px 0;
        }

        .doc-title {
          font-size: 16px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .doc-subtitle {
          font-size: 11px;
          font-style: italic;
          margin-top: 1px;
        }

        .meta-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3px 16px;
          margin-bottom: 10px;
          font-size: 11.5px;
          border: 1px dashed #666;
          padding: 5px 10px;
          border-radius: 3px;
        }

        /* DIVISION SECTION */
        .division-section {
          margin-bottom: 16px;
          page-break-after: auto;
        }

        .division-heading {
          background: #0a1f44;
          color: #fff;
          padding: 4px 8px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
          border-radius: 3px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* 2-COLUMN EVALUATION TABLE */
        .eval-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }

        .eval-table thead th {
          background: #1e293b;
          color: #fff;
          padding: 5px 8px;
          font-size: 11px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          border: 1.5px solid #1e293b;
        }

        .eval-table thead th.th-info {
          width: 48%;
          text-align: left;
        }

        .eval-table thead th.th-eval {
          width: 52%;
          text-align: left;
        }

        .candidate-row {
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .candidate-row td {
          border: 1.5px solid #333;
          padding: 5px 8px;
          vertical-align: top;
          background: #fff;
        }

        /* LEFT COLUMN: CANDIDATE INFO (COMPACT) */
        .col-info {
          width: 48%;
        }

        .cand-headline {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 3px;
          flex-wrap: wrap;
        }

        .stt-badge {
          background: #0a1f44;
          color: #fff;
          font-weight: bold;
          font-size: 10px;
          padding: 1px 5px;
          border-radius: 2px;
          font-family: Arial, sans-serif;
          white-space: nowrap;
        }

        .cand-name-mssv {
          font-size: 13px;
          color: #000;
        }

        .cand-name-mssv strong.name {
          font-weight: bold;
          text-transform: uppercase;
        }

        .cand-name-mssv span.mssv {
          margin-left: 6px;
          font-size: 11.5px;
          color: #1e293b;
        }

        .cand-details-box {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 2px;
          padding: 3px 6px;
          font-size: 11px;
          line-height: 1.3;
        }

        .detail-item {
          display: flex;
          gap: 4px;
          margin-bottom: 1.5px;
        }

        .detail-item:last-child {
          margin-bottom: 0;
        }

        .d-lbl {
          color: #475569;
          white-space: nowrap;
          font-size: 10.5px;
          min-width: 62px;
        }

        .d-txt {
          color: #000;
          word-break: break-word;
        }

        .font-bold {
          font-weight: bold;
        }

        /* RIGHT COLUMN: EVALUATION WITH TOP-RIGHT CHECKBOXES & 3 LINES */
        .col-eval {
          width: 52%;
        }

        .eval-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px dashed #999;
          padding-bottom: 2px;
          margin-bottom: 4px;
        }

        .eval-title {
          font-size: 10.5px;
          font-weight: bold;
          text-transform: uppercase;
          color: #111;
        }

        /* TOP-RIGHT CHECKBOXES */
        .checkbox-group-top-right {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .checkbox-item {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 10.5px;
          font-weight: bold;
          color: #000;
        }

        .box-square {
          width: 13px;
          height: 13px;
          border: 1.5px solid #000;
          border-radius: 2px;
          display: inline-block;
          background: #fff;
        }

        /* 3-LINE RULED FEEDBACK */
        .ruled-feedback-container {
          border: 1px solid #999;
          background: #fff;
          border-radius: 2px;
          overflow: hidden;
        }

        .rule-line-3 {
          height: 19px;
          border-bottom: 1px dotted #888;
          display: flex;
          align-items: center;
          padding-left: 5px;
        }

        .rule-line-3:last-child {
          border-bottom: none;
        }

        .line-index {
          font-size: 9px;
          color: #888;
          user-select: none;
          width: 12px;
          font-family: monospace;
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

          .candidate-row {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .division-heading, .eval-table thead th {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          @page {
            size: A4 portrait;
            margin: 8mm 7mm;
          }
        }
      </style>
    </head>
    <body>
      <div class="no-print-toolbar">
        <div>
          <strong>BẢNG CHẤM ĐIỂM &amp; ĐÁNH GIÁ CASTING HMC 2026</strong>
          <span style="font-size: 12px; opacity: 0.8; margin-left: 10px;">— Sắp xếp A → Z theo Tên thí sinh (Bảng 2 cột, 3 dòng nhận xét)</span>
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
          <div class="doc-subtitle">(Danh sách thí sinh được tự động sắp xếp theo thứ tự chữ cái A → Z theo Tên trong từng mảng)</div>
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
                <span style="font-size: 11px; font-weight: normal; opacity: 0.9;">Tổng số: ${group.list.length} thí sinh</span>
              </div>

              <table class="eval-table">
                <thead>
                  <tr>
                    <th class="th-info">THÔNG TIN THÍ SINH</th>
                    <th class="th-eval">NHẬN XÉT &amp; ĐÁNH GIÁ CỦA BAN GIÁM KHẢO</th>
                  </tr>
                </thead>
                <tbody>
                  ${group.list
                    .map(
                      (c, idx) => `
                    <tr class="candidate-row">
                      <!-- CỘT BÊN TRÁI: THÔNG TIN THÍ SINH -->
                      <td class="col-info">
                        <div class="cand-headline">
                          <span class="stt-badge">STT: ${idx + 1 < 10 ? '0' + (idx + 1) : idx + 1}/${group.list.length < 10 ? '0' + group.list.length : group.list.length}</span>
                          <span class="cand-name-mssv">
                            <strong class="name">${c.fullName}</strong>
                            <span class="mssv">— MSSV: <strong>${c.studentId || 'Chưa có'}</strong></span>
                          </span>
                        </div>

                        <div class="cand-details-box">
                          <div class="detail-item">
                            <span class="d-lbl">Tác phẩm:</span>
                            <span class="d-txt font-bold">${c.castingSong || '(Chưa đăng ký)'}</span>
                          </div>
                          <div class="detail-item">
                            <span class="d-lbl">Kinh nghiệm:</span>
                            <span class="d-txt">${c.hasPerformanceExperience ? 'Đã từng diễn sân khấu' : 'Chưa có'}</span>
                          </div>
                        </div>
                      </td>

                      <!-- CỘT BÊN PHẢI: NHẬN XÉT VỚI Ô ĐÁNH DẤU TÍCH GÓC TRÊN BÊN PHẢI VÀ 3 DÒNG KẺ -->
                      <td class="col-eval">
                        <div class="eval-top-bar">
                          <span class="eval-title">ĐÁNH GIÁ &amp; NHẬN XÉT:</span>
                          <!-- Ô ĐÁNH DẤU TÍCH GÓC TRÊN BÊN PHẢI -->
                          <div class="checkbox-group-top-right">
                            <span class="checkbox-item"><span class="box-square"></span> ĐẠT</span>
                            <span class="checkbox-item"><span class="box-square"></span> DỰ BỊ</span>
                            <span class="checkbox-item"><span class="box-square"></span> LOẠI</span>
                          </div>
                        </div>

                        <!-- 3 DÒNG KẺ NHẬN XÉT -->
                        <div class="ruled-feedback-container">
                          <div class="rule-line-3"><span class="line-index">1</span></div>
                          <div class="rule-line-3"><span class="line-index">2</span></div>
                          <div class="rule-line-3"><span class="line-index">3</span></div>
                        </div>
                      </td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          `
          )
          .join('')}
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
