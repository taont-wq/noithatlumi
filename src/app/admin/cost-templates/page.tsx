'use client';

import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { DataTable, type Column } from '@/components/admin/DataTable';

interface Template {
  id: string;
  name: string;
  bedroomCount: number | null;
  style: string | null;
  baseArea: number | null;
  isDefault: boolean;
  _count: { items: number };
}

export default function AdminCostTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/cost-templates')
      .then((r) => r.json())
      .then((json) => setTemplates(json.data ?? []))
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false));
  }, []);

  const columns: Column<Template>[] = [
    { key: 'name', label: 'Tên template', sortable: true },
    { key: 'bedroomCount', label: 'Số PN', render: (t) => t.bedroomCount ?? '—' },
    { key: 'style', label: 'Phong cách', render: (t) => t.style ?? '—' },
    { key: 'baseArea', label: 'DT nền', render: (t) => (t.baseArea ? `${t.baseArea}m²` : '—') },
    {
      key: 'isDefault',
      label: 'Mặc định',
      render: (t) => (t.isDefault ? '✅' : '—'),
    },
    {
      key: '_count',
      label: 'Số mục',
      render: (t) => t._count.items,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Template dự toán</h1>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={templates}
        keyField="id"
        loading={loading}
        searchPlaceholder="Tìm template..."
      />
    </div>
  );
}
