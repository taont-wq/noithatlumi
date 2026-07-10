interface Props {
  estimate: {
    id: string;
    status: string;
    totalMin: number;
    totalMax: number;
    breakdown: Record<string, unknown>;
    pdfUrl: string | null;
    templateName: string | null;
  };
}

const ESTIMATE_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Bản nháp',
  SENT: 'Đã gửi',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
  EXPIRED: 'Hết hạn',
};

const ESTIMATE_STATUS_COLORS: Record<string, string> = {
  DRAFT: 'text-yellow-600 bg-yellow-50',
  SENT: 'text-blue-600 bg-blue-50',
  APPROVED: 'text-emerald-600 bg-emerald-50',
  REJECTED: 'text-rose-600 bg-rose-50',
  EXPIRED: 'text-gray-600 bg-gray-50',
};

export function ApartmentEstimateCard({ estimate }: Props) {
  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Dự toán chi phí</h3>
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
              ESTIMATE_STATUS_COLORS[estimate.status] ?? 'bg-gray-100 text-gray-700'
            }`}
          >
            {ESTIMATE_STATUS_LABELS[estimate.status] ?? estimate.status}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Khoảng giá</p>
          <p className="text-2xl font-bold">
            {(estimate.totalMin / 1_000_000).toFixed(0)} -{' '}
            {(estimate.totalMax / 1_000_000).toFixed(0)}
            <span className="ml-1 text-sm font-normal text-muted-foreground">triệu</span>
          </p>
        </div>

        {estimate.templateName && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
            <span>Template: {estimate.templateName}</span>
          </div>
        )}

        {estimate.pdfUrl && (
          <a
            href={estimate.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-full items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors hover:bg-secondary"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Tải PDF dự toán
          </a>
        )}
      </div>
    </div>
  );
}
