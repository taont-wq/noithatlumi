import { SITE, CONTACT, ADDRESSES } from '@/lib/constants';

interface EstimateItem {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitPriceMin: number;
  unitPriceMax: number;
}

interface EstimateInput {
  apartmentCode: string;
  projectName: string;
  towerName: string;
  area: number | null;
  bedroomCount: number;
  items: EstimateItem[];
  totalMin: number;
  totalMax: number;
  notes?: string | null;
}

export async function generateEstimateHtml(input: EstimateInput): Promise<string> {
  const {
    apartmentCode,
    projectName,
    towerName,
    area,
    bedroomCount,
    items,
    totalMin,
    totalMax,
    notes,
  } = input;

  const rows = items
    .map(
      (item, i) => `
    <tr${i % 2 === 1 ? ' style="background:#f8f7f4"' : ''}>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e3df;font-size:13px">${item.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e3df;font-size:13px;text-align:center">${item.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e3df;font-size:13px;text-align:center">${item.unit}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e3df;font-size:13px;text-align:right">${(item.unitPriceMin / 1000).toFixed(0)}k</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e3df;font-size:13px;text-align:right">${(item.unitPriceMax / 1000).toFixed(0)}k</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e3df;font-size:13px;text-align:right">${(item.unitPriceMin * item.quantity / 1000000).toFixed(0)}tr</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e3df;font-size:13px;text-align:right">${(item.unitPriceMax * item.quantity / 1000000).toFixed(0)}tr</td>
    </tr>`
    )
    .join('\n');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Báo giá - ${apartmentCode}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Outfit', sans-serif;
      color: #1c1c1c;
      background: #fff;
      padding: 40px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      border-bottom: 2px solid #d4a843;
      padding-bottom: 24px;
      margin-bottom: 24px;
    }
    .brand { font-family: 'Cormorant Garamond', serif; }
    .brand h1 { font-size: 28px; font-weight: 600; color: #1c1c1c; }
    .brand .gold { color: #d4a843; }
    .brand p { font-size: 12px; color: #888; margin-top: 4px; }
    .meta { text-align: right; font-size: 13px; color: #555; }
    .meta strong { color: #1c1c1c; }
    .title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 22px;
      font-weight: 600;
      color: #d4a843;
      margin-bottom: 16px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 24px;
      padding: 16px;
      background: #f8f7f4;
      border-radius: 8px;
      font-size: 13px;
    }
    .info-grid .label { color: #888; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th {
      background: #1c1c1c;
      color: #fff;
      padding: 10px 12px;
      font-size: 12px;
      font-weight: 500;
      text-align: left;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    th.right { text-align: right; }
    th.center { text-align: center; }
    .total-row td {
      padding: 12px;
      font-weight: 600;
      font-size: 14px;
      border-top: 2px solid #d4a843;
    }
    .footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #e5e3df;
      font-size: 12px;
      color: #888;
      text-align: center;
    }
    .notes {
      margin-top: 16px;
      padding: 12px 16px;
      background: #fff8e6;
      border-radius: 8px;
      font-size: 13px;
      color: #8b7a3e;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <h1>${SITE.name}</h1>
      <p>${SITE.tagline}</p>
    </div>
    <div class="meta">
      <p><strong>Báo giá thiết kế & thi công nội thất</strong></p>
      <p>Ngày: ${new Date().toLocaleDateString('vi-VN')}</p>
      <p>Mã báo giá: BG-${apartmentCode.replace(/\s/g, '')}-${Date.now().toString(36).toUpperCase()}</p>
    </div>
  </div>

  <h2 class="title">Dự toán chi phí</h2>

  <div class="info-grid">
    <div><span class="label">Căn hộ:</span> ${apartmentCode}</div>
    <div><span class="label">Dự án:</span> ${projectName}</div>
    <div><span class="label">Tòa:</span> ${towerName}</div>
    <div><span class="label">Diện tích:</span> ${area ? `${area}m²` : '—'}</div>
    <div><span class="label">Phòng ngủ:</span> ${bedroomCount}</div>
    <div><span class="label">Phong cách:</span> Modern Luxury</div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:30%">Hạng mục</th>
        <th class="center" style="width:8%">SL</th>
        <th class="center" style="width:8%">ĐVT</th>
        <th class="right" style="width:13%">ĐG Min</th>
        <th class="right" style="width:13%">ĐG Max</th>
        <th class="right" style="width:14%">TT Min</th>
        <th class="right" style="width:14%">TT Max</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
      <tr class="total-row">
        <td colspan="5" style="text-align:right">Tổng cộng (dự kiến):</td>
        <td style="text-align:right;color:#d4a843">${(totalMin / 1000000).toFixed(0)} triệu</td>
        <td style="text-align:right;color:#d4a843">${(totalMax / 1000000).toFixed(0)} triệu</td>
      </tr>
    </tbody>
  </table>

  ${notes ? `<div class="notes"><strong>Ghi chú:</strong> ${notes}</div>` : ''}

  <div class="footer">
    <p>${SITE.name} — ${CONTACT.phone} — ${CONTACT.email}</p>
    ${ADDRESSES.map(a => `<p>${a}</p>`).join('\n    ')}
    <p style="margin-top:8px;font-size:10px">Báo giá có hiệu lực trong 30 ngày. Giá chưa bao gồm VAT.</p>
  </div>
</body>
</html>`;
}

export async function generateEstimatePdf(input: EstimateInput): Promise<Buffer> {
  const html = await generateEstimateHtml(input);

  // Puppeteer is optional — install with: npm install puppeteer
  // @ts-ignore — dynamic load avoids TS module-not-found
  let puppeteerMod: any;
  try {
    puppeteerMod = await (Function('return import("' + 'puppeteer' + '")')());
  } catch {
    throw new Error(
      'PDF generation requires puppeteer.\n' +
      'Install: npm install puppeteer\n' +
      'Preview: call generateEstimateHtml() instead'
    );
  }

  const browser = await puppeteerMod.default.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
      printBackground: true,
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
