'use client';

import { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { DataTable, type Column } from '@/components/admin/DataTable';

interface CostItem {
  id: string;
  name: string;
  unit: string;
  unitPriceMin: number;
  unitPriceMax: number;
  isActive: boolean;
  category: { name: string; icon: string | null };
}

export default function AdminCostItemsPage() {
  const [items, setItems] = useState<CostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/cost-items')
      .then((r) => r.json())
      .then((json) => setItems(json.data ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const columns: Column<CostItem>[] = [
    { key: 'name', label: 'Tên vật tư', sortable: true },
    {
      key: 'category',
      label: 'Danh mục',
      render: (i) => i.category?.name ?? '—',
    },
    { key: 'unit', label: 'Đơn vị' },
    {
      key: 'unitPriceMin',
      label: 'Giá min',
      render: (i) => i.unitPriceMin.toLocaleString('vi-VN'),
    },
    {
      key: 'unitPriceMax',
      label: 'Giá max',
      render: (i) => i.unitPriceMax.toLocaleString('vi-VN'),
    },
    {
      key: 'isActive',
      label: 'Kích hoạt',
      render: (i) => (i.isActive ? '✅' : '❌'),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ClipboardList className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Vật tư nội thất</h1>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={items}
        keyField="id"
        loading={loading}
        searchPlaceholder="Tìm vật tư..."
      />
    </div>
  );
}
