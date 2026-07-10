'use client';

import { useEffect, useState } from 'react';
import { Calculator, Download } from 'lucide-react';
import { DataTable, type Column } from '@/components/admin/DataTable';

interface Estimate {
  id: string;
  status: string;
  totalMin: number;
  totalMax: number;
  createdAt: string;
  apartment: { code: string; slug: string };
  template: { name: string } | null;
}

const STATUS: Record<string, string> = {
  DRAFT: 'Nháp', SENT: 'Đã gửi', APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối', EXPIRED: 'Hết hạn',
};

export default function AdminCostEstimatesPage() {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/cost-estimates')
      .then((r) => r.json())
      .then((json) => setEstimates(json.data ?? []))
      .catch(() => setEstimates([]))
      .finally(() => setLoading(false));
  }, []);

  const columns: Column<Estimate>[] = [
    {
      key: 'apartment',
      label: 'Căn hộ',
      render: (e) => e.apartment?.code ?? '—',
    },
    {
      key: 'template',
      label: 'Template',
      render: (e) => e.template?.name ?? '—',
    },
    {
      key: 'totalMin',
      label: 'Khoảng giá',
      render: (e) => `${(e.totalMin / 1_000_000).toFixed(0)} - ${(e.totalMax / 1_000_000).toFixed(0)}M`,
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (e) => STATUS[e.status] ?? e.status,
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      render: (e) => new Date(e.createdAt).toLocaleDateString('vi-VN'),
    },
    {
      key: 'id',
      label: '',
      render: () => (
        <button className="rounded p-1.5 text-muted-foreground hover:bg-muted" title="Tải PDF">
          <Download className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calculator className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Dự toán chi phí</h1>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={estimates}
        keyField="id"
        loading={loading}
        searchPlaceholder="Tìm dự toán..."
      />
    </div>
  );
}
