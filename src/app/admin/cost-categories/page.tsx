'use client';

import { useEffect, useState } from 'react';
import { List } from 'lucide-react';
import { DataTable, type Column } from '@/components/admin/DataTable';

interface Category {
  id: string;
  name: string;
  icon: string | null;
  order: number;
  isActive: boolean;
  _count: { items: number };
}

export default function AdminCostCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/cost-categories')
      .then((r) => r.json())
      .then((json) => setCategories(json.data ?? []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  const columns: Column<Category>[] = [
    { key: 'name', label: 'Tên danh mục', sortable: true },
    { key: 'icon', label: 'Icon', render: (c) => c.icon ?? '—' },
    {
      key: '_count',
      label: 'Số mục',
      render: (c) => c._count.items,
    },
    {
      key: 'isActive',
      label: 'Kích hoạt',
      render: (c) => (c.isActive ? '✅' : '❌'),
    },
    { key: 'order', label: 'Thứ tự' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <List className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Danh mục chi phí</h1>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={categories}
        keyField="id"
        loading={loading}
        searchPlaceholder="Tìm danh mục..."
      />
    </div>
  );
}
