'use client';

import { Calculator } from 'lucide-react';

export default function AdminEstimatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calculator className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Dự toán chi phí</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý bảng dự toán chi phí nội thất
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-20 text-center">
        <Calculator className="mb-4 h-16 w-16 text-muted-foreground/20" />
        <h2 className="mb-2 text-lg font-semibold">Tính năng đang phát triển</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Chức năng quản lý dự toán chi phí nội thất sẽ sớm được ra mắt.
          Bạn có thể quản lý danh mục vật tư, template dự toán và báo giá cho từng căn hộ.
        </p>
      </div>
    </div>
  );
}
