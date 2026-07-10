'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminForm } from '@/components/admin/AdminForm';
import { Building2 } from 'lucide-react';

interface ProjectFormData {
  name: string;
  slug: string;
  shortDesc: string;
  location: string;
  developer: string;
  status: string;
  order: number;
  thumbnail: string;
}

export default function AdminProjectFormPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);
  const [defaults, setDefaults] = useState<Partial<ProjectFormData>>({});

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/admin/projects/${id}`)
      .then((r) => r.json())
      .then((json) => {
        const p = json.data;
        setDefaults({
          name: p.name ?? '',
          slug: p.slug ?? '',
          shortDesc: p.shortDesc ?? '',
          location: p.location ?? '',
          developer: p.developer ?? '',
          status: p.status ?? 'ACTIVE',
          order: p.order ?? 0,
          thumbnail: p.thumbnail ?? '',
        });
      })
      .catch(() => setError('Không thể tải dữ liệu dự án'))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    setError(null);
    try {
      const url = isNew ? '/api/admin/projects' : `/api/admin/projects/${id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? 'Lỗi khi lưu dự án');
      }
      router.push('/admin/projects');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {isNew ? 'Thêm dự án mới' : 'Chỉnh sửa dự án'}
          </h1>
        </div>
      </div>

      <AdminForm
        title=""
        backHref="/admin/projects"
        onSubmit={handleSubmit}
        error={error}
        submitLabel={isNew ? 'Tạo dự án' : 'Lưu thay đổi'}
      >
        <div className="grid gap-6 rounded-lg border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Tên dự án <span className="text-rose-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                required
                defaultValue={defaults.name ?? ''}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-medium">
                Slug <span className="text-rose-500">*</span>
              </label>
              <input
                id="slug"
                name="slug"
                required
                defaultValue={defaults.slug ?? ''}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="du-an-ten"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="shortDesc" className="text-sm font-medium">
              Mô tả ngắn
            </label>
            <textarea
              id="shortDesc"
              name="shortDesc"
              rows={2}
              defaultValue={defaults.shortDesc ?? ''}
              className="flex w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Vị trí
              </label>
              <input
                id="location"
                name="location"
                defaultValue={defaults.location ?? ''}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="developer" className="text-sm font-medium">
                Chủ đầu tư
              </label>
              <input
                id="developer"
                name="developer"
                defaultValue={defaults.developer ?? ''}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Trạng thái
              </label>
              <select
                id="status"
                name="status"
                defaultValue={defaults.status ?? 'ACTIVE'}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="COMING_SOON">Sắp ra mắt</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="ARCHIVED">Đã lưu trữ</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="order" className="text-sm font-medium">
                Thứ tự
              </label>
              <input
                id="order"
                name="order"
                type="number"
                defaultValue={defaults.order ?? 0}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="thumbnail" className="text-sm font-medium">
                URL ảnh đại diện
              </label>
              <input
                id="thumbnail"
                name="thumbnail"
                defaultValue={defaults.thumbnail ?? ''}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>
      </AdminForm>
    </div>
  );
}
