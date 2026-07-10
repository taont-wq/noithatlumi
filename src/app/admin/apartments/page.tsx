'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DoorOpen, Pencil, Trash2 } from 'lucide-react';
import { DataTable, type Column } from '@/components/admin/DataTable';

interface ApartmentRow {
  id: string;
  code: string;
  slug: string;
  bedroomCount: number;
  area: number | null;
  status: string;
  priceEstimate: number | null;
  tower: { name: string; project: { name: string } } | null;
  images: { url: string }[];
}

const STATUS_BADGES: Record<string, string> = {
  AVAILABLE: 'bg-emerald-100 text-emerald-700',
  RESERVED: 'bg-amber-100 text-amber-700',
  SOLD: 'bg-rose-100 text-rose-700',
  DESIGNING: 'bg-blue-100 text-blue-700',
  CONSTRUCTING: 'bg-violet-100 text-violet-700',
  COMPLETED: 'bg-teal-100 text-teal-700',
  HIDDEN: 'bg-gray-100 text-gray-700',
};

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Còn hàng',
  RESERVED: 'Đã cọc',
  SOLD: 'Đã bán',
  DESIGNING: 'Đang thiết kế',
  CONSTRUCTING: 'Đang xây',
  COMPLETED: 'Hoàn thiện',
  HIDDEN: 'Ẩn',
};

export default function AdminApartmentsPage() {
  const router = useRouter();
  const [apartments, setApartments] = useState<ApartmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/apartments')
      .then((r) => r.json())
      .then((json) => setApartments(json.data ?? []))
      .catch(() => setApartments([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa căn hộ này?')) return;
    try {
      const res = await fetch(`/api/admin/apartments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setApartments((prev) => prev.filter((a) => a.id !== id));
        router.refresh();
      }
    } catch {}
  };

  const columns: Column<ApartmentRow>[] = [
    {
      key: 'code',
      label: 'Mã căn',
      sortable: true,
      render: (a) => (
        <Link href={`/admin/apartments/${a.id}`} className="font-medium hover:text-primary">
          {a.code}
        </Link>
      ),
    },
    {
      key: 'tower',
      label: 'Dự án / Tòa',
      render: (a) =>
        a.tower ? (
          <span className="text-muted-foreground">
            {a.tower.project.name} — {a.tower.name}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: 'bedroomCount',
      label: 'PN',
      sortable: true,
      className: 'text-center',
    },
    {
      key: 'area',
      label: 'Diện tích',
      render: (a) => (a.area ? `${a.area} m²` : '—'),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (a) => (
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
            STATUS_BADGES[a.status] ?? 'bg-gray-100 text-gray-700'
          }`}
        >
          {STATUS_LABELS[a.status] ?? a.status}
        </span>
      ),
    },
    {
      key: 'priceEstimate',
      label: 'Giá dự kiến',
      render: (a) =>
        a.priceEstimate
          ? `${(a.priceEstimate / 1_000_000).toFixed(0)}M`
          : '—',
    },
    {
      key: 'id',
      label: '',
      className: 'w-20 text-right',
      render: (a) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/apartments/${a.id}`}
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(a.id)}
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <DoorOpen className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Căn hộ</h1>
          <p className="text-sm text-muted-foreground">Quản lý danh sách căn hộ</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={apartments}
        keyField="id"
        loading={loading}
        searchPlaceholder="Tìm kiếm căn hộ..."
        newButton={{ label: 'Thêm căn hộ', href: '/admin/apartments/new' }}
      />
    </div>
  );
}
