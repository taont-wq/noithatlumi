'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, Pencil, Trash2, Plus } from 'lucide-react';
import { DataTable, type Column } from '@/components/admin/DataTable';

interface Project {
  id: string;
  slug: string;
  name: string;
  shortDesc: string | null;
  status: string;
  order: number;
  thumbnail: string | null;
  _count: { towers: number };
}

const STATUS_BADGES: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  COMING_SOON: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-teal-100 text-teal-700',
  ARCHIVED: 'bg-gray-100 text-gray-700',
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Đang hoạt động',
  COMING_SOON: 'Sắp ra mắt',
  COMPLETED: 'Hoàn thành',
  ARCHIVED: 'Đã lưu trữ',
};

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/projects')
      .then((r) => r.json())
      .then((json) => setProjects(json.data ?? []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa dự án này?')) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        router.refresh();
      }
    } catch {}
  };

  const columns: Column<Project>[] = [
    {
      key: 'name',
      label: 'Tên dự án',
      sortable: true,
      render: (p) => (
        <Link href={`/admin/projects/${p.id}`} className="font-medium hover:text-primary">
          {p.name}
        </Link>
      ),
    },
    {
      key: 'slug',
      label: 'Slug',
      className: 'text-muted-foreground',
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (p) => (
        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGES[p.status] ?? 'bg-gray-100 text-gray-700'}`}>
          {STATUS_LABELS[p.status] ?? p.status}
        </span>
      ),
    },
    {
      key: '_count',
      label: 'Tòa nhà',
      render: (p) => p._count.towers,
    },
    {
      key: 'id',
      label: '',
      className: 'w-20 text-right',
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/projects/${p.id}`}
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(p.id)}
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
        <Building2 className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Dự án</h1>
          <p className="text-sm text-muted-foreground">Quản lý danh sách dự án</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={projects}
        keyField="id"
        loading={loading}
        searchPlaceholder="Tìm kiếm dự án..."
        newButton={{ label: 'Thêm dự án', href: '/admin/projects/new' }}
      />
    </div>
  );
}
