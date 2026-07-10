'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminForm } from '@/components/admin/AdminForm';
import { DoorOpen } from 'lucide-react';

interface ApartmentFormData {
  code: string;
  slug: string;
  towerId: string;
  floor: number | null;
  unitNumber: string;
  bedroomCount: number;
  bathroomCount: number;
  area: number | null;
  direction: string;
  layoutType: string;
  status: string;
  priceEstimate: number | null;
  description: string;
  highlights: string;
  styleTags: string;
  floorPlanPdf: string;
  floorPlanImg: string;
  seoTitle: string;
  seoDesc: string;
  seoKeywords: string;
}

export default function AdminApartmentFormPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);
  const [defaults, setDefaults] = useState<Partial<ApartmentFormData>>({});

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/admin/apartments/${id}`)
      .then((r) => r.json())
      .then((json) => {
        const a = json.data;
        let highlights = '';
        let styleTags = '';
        let seoKeywords = '';
        try { highlights = JSON.parse(a.highlights ?? '[]').join('\n'); } catch {}
        try { styleTags = JSON.parse(a.styleTags ?? '[]').join(', '); } catch {}
        try { seoKeywords = JSON.parse(a.seoKeywords ?? '[]').join(', '); } catch {}

        setDefaults({
          code: a.code ?? '',
          slug: a.slug ?? '',
          towerId: a.towerId ?? '',
          floor: a.floor ?? null,
          unitNumber: a.unitNumber ?? '',
          bedroomCount: a.bedroomCount ?? 2,
          bathroomCount: a.bathroomCount ?? 1,
          area: a.area ?? null,
          direction: a.direction ?? '',
          layoutType: a.layoutType ?? '',
          status: a.status ?? 'AVAILABLE',
          priceEstimate: a.priceEstimate ?? null,
          description: a.description ?? '',
          highlights,
          styleTags,
          floorPlanPdf: a.floorPlanPdf ?? '',
          floorPlanImg: a.floorPlanImg ?? '',
          seoTitle: a.seoTitle ?? '',
          seoDesc: a.seoDesc ?? '',
          seoKeywords,
        });
      })
      .catch(() => setError('Không thể tải dữ liệu căn hộ'))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    setError(null);
    try {
      // Parse textarea fields into JSON arrays
      const highlights = (data.highlights as string || '')
        .split('\n')
        .map((s: string) => s.trim())
        .filter(Boolean);
      const styleTags = (data.styleTags as string || '')
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
      const seoKeywords = (data.seoKeywords as string || '')
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);

      const body = { ...data, highlights, styleTags, seoKeywords };

      const url = isNew ? '/api/admin/apartments' : `/api/admin/apartments/${id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? 'Lỗi khi lưu căn hộ');
      }
      router.push('/admin/apartments');
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
        <DoorOpen className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {isNew ? 'Thêm căn hộ mới' : 'Chỉnh sửa căn hộ'}
          </h1>
        </div>
      </div>

      <AdminForm
        title=""
        backHref="/admin/apartments"
        onSubmit={handleSubmit}
        error={error}
        submitLabel={isNew ? 'Tạo căn hộ' : 'Lưu thay đổi'}
      >
        {/* Basic info */}
        <fieldset className="rounded-lg border bg-card p-6">
          <legend className="text-sm font-semibold text-muted-foreground px-1">
            Thông tin cơ bản
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium">
                Mã căn <span className="text-rose-500">*</span>
              </label>
              <input
                id="code" name="code" required
                defaultValue={defaults.code ?? ''}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-medium">
                Slug <span className="text-rose-500">*</span>
              </label>
              <input
                id="slug" name="slug" required
                defaultValue={defaults.slug ?? ''}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="towerId" className="text-sm font-medium">Tower ID</label>
              <input
                id="towerId" name="towerId"
                defaultValue={defaults.towerId ?? ''}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="unitNumber" className="text-sm font-medium">Số căn</label>
              <input
                id="unitNumber" name="unitNumber"
                defaultValue={defaults.unitNumber ?? ''}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </fieldset>

        {/* Specs */}
        <fieldset className="rounded-lg border bg-card p-6">
          <legend className="text-sm font-semibold text-muted-foreground px-1">
            Thông số
          </legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="bedroomCount" className="text-sm font-medium">
                Phòng ngủ
              </label>
              <input
                id="bedroomCount" name="bedroomCount" type="number"
                defaultValue={defaults.bedroomCount ?? 2}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="bathroomCount" className="text-sm font-medium">
                Phòng tắm
              </label>
              <input
                id="bathroomCount" name="bathroomCount" type="number"
                defaultValue={defaults.bathroomCount ?? 1}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="area" className="text-sm font-medium">Diện tích (m²)</label>
              <input
                id="area" name="area" type="number" step="0.1"
                defaultValue={defaults.area ?? ''}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="floor" className="text-sm font-medium">Tầng</label>
              <input
                id="floor" name="floor" type="number"
                defaultValue={defaults.floor ?? ''}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="direction" className="text-sm font-medium">Hướng</label>
              <select id="direction" name="direction"
                defaultValue={defaults.direction ?? ''}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">—</option>
                <option value="EAST">Đông</option>
                <option value="WEST">Tây</option>
                <option value="SOUTH">Nam</option>
                <option value="NORTH">Bắc</option>
                <option value="NORTHEAST">Đông Bắc</option>
                <option value="NORTHWEST">Tây Bắc</option>
                <option value="SOUTHEAST">Đông Nam</option>
                <option value="SOUTHWEST">Tây Nam</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="layoutType" className="text-sm font-medium">Loại</label>
              <select id="layoutType" name="layoutType"
                defaultValue={defaults.layoutType ?? ''}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">—</option>
                <option value="1PN+">1PN+</option>
                <option value="2PN">2PN</option>
                <option value="3PN">3PN</option>
                <option value="Studio">Studio</option>
                <option value="Duplex">Duplex</option>
                <option value="Penhouse">Penthouse</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Status & Price */}
        <fieldset className="rounded-lg border bg-card p-6">
          <legend className="text-sm font-semibold text-muted-foreground px-1">
            Trạng thái & Giá
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">Trạng thái</label>
              <select id="status" name="status"
                defaultValue={defaults.status ?? 'AVAILABLE'}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="AVAILABLE">Còn hàng</option>
                <option value="RESERVED">Đã cọc</option>
                <option value="SOLD">Đã bán</option>
                <option value="DESIGNING">Đang thiết kế</option>
                <option value="CONSTRUCTING">Đang xây</option>
                <option value="COMPLETED">Hoàn thiện</option>
                <option value="HIDDEN">Ẩn</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="priceEstimate" className="text-sm font-medium">
                Giá dự kiến (VND)
              </label>
              <input
                id="priceEstimate" name="priceEstimate" type="number"
                defaultValue={defaults.priceEstimate ?? ''}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </fieldset>

        {/* Description */}
        <fieldset className="rounded-lg border bg-card p-6">
          <legend className="text-sm font-semibold text-muted-foreground px-1">
            Mô tả
          </legend>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Mô tả</label>
            <textarea id="description" name="description" rows={4}
              defaultValue={defaults.description ?? ''}
              className="flex w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="mt-4 space-y-2">
            <label htmlFor="highlights" className="text-sm font-medium">
              Điểm nổi bật (mỗi dòng một điểm)
            </label>
            <textarea id="highlights" name="highlights" rows={3}
              defaultValue={defaults.highlights ?? ''}
              className="flex w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="mt-4 space-y-2">
            <label htmlFor="styleTags" className="text-sm font-medium">
              Phong cách (phân cách bằng dấu phẩy)
            </label>
            <input id="styleTags" name="styleTags"
              defaultValue={defaults.styleTags ?? ''}
              className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </fieldset>

        {/* Floor plan */}
        <fieldset className="rounded-lg border bg-card p-6">
          <legend className="text-sm font-semibold text-muted-foreground px-1">
            Mặt bằng
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="floorPlanImg" className="text-sm font-medium">
                URL ảnh mặt bằng
              </label>
              <input id="floorPlanImg" name="floorPlanImg"
                defaultValue={defaults.floorPlanImg ?? ''}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="floorPlanPdf" className="text-sm font-medium">
                URL PDF mặt bằng
              </label>
              <input id="floorPlanPdf" name="floorPlanPdf"
                defaultValue={defaults.floorPlanPdf ?? ''}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </fieldset>

        {/* SEO */}
        <fieldset className="rounded-lg border bg-card p-6">
          <legend className="text-sm font-semibold text-muted-foreground px-1">
            SEO
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="seoTitle" className="text-sm font-medium">SEO Title</label>
              <input id="seoTitle" name="seoTitle"
                defaultValue={defaults.seoTitle ?? ''}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="seoKeywords" className="text-sm font-medium">
                SEO Keywords (phân cách bằng dấu phẩy)
              </label>
              <input id="seoKeywords" name="seoKeywords"
                defaultValue={defaults.seoKeywords ?? ''}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <label htmlFor="seoDesc" className="text-sm font-medium">SEO Description</label>
            <textarea id="seoDesc" name="seoDesc" rows={2}
              defaultValue={defaults.seoDesc ?? ''}
              className="flex w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </fieldset>
      </AdminForm>
    </div>
  );
}
