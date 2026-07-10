'use client';

import { useEffect, useState } from 'react';
import { Building2, DoorOpen, Calculator, TrendingUp } from 'lucide-react';

interface DashboardStats {
  projects: number;
  towers: number;
  apartments: number;
  estimates: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        setStats({
          projects: data.stats?.projects ?? 0,
          towers: data.stats?.towers ?? 0,
          apartments: data.stats?.apartments ?? 0,
          estimates: data.stats?.estimates ?? 0,
        });
      } catch {
        setStats({ projects: 0, towers: 0, apartments: 0, estimates: 0 });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    {
      label: 'Dự án',
      value: stats?.projects ?? 0,
      icon: Building2,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Tòa nhà',
      value: stats?.towers ?? 0,
      icon: TrendingUp,
      color: 'text-violet-600 bg-violet-50',
    },
    {
      label: 'Căn hộ',
      value: stats?.apartments ?? 0,
      icon: DoorOpen,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Dự toán',
      value: stats?.estimates ?? 0,
      icon: Calculator,
      color: 'text-amber-600 bg-amber-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tổng quan</h1>
        <p className="text-sm text-muted-foreground">
          Bảng điều khiển quản trị hệ thống
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-2.5 ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {loading ? (
                    <span className="inline-block h-8 w-12 animate-pulse rounded bg-muted" />
                  ) : (
                    card.value
                  )}
                </p>
                <p className="text-sm text-muted-foreground">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Truy cập nhanh</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/admin/projects"
            className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <Building2 className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium">Quản lý dự án</span>
          </a>
          <a
            href="/admin/apartments"
            className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <DoorOpen className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium">Quản lý căn hộ</span>
          </a>
          <a
            href="/admin/estimates"
            className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <Calculator className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-medium">Dự toán chi phí</span>
          </a>
          <a
            href="/admin/settings"
            className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <TrendingUp className="h-5 w-5 text-violet-600" />
            <span className="text-sm font-medium">Cài đặt hệ thống</span>
          </a>
        </div>
      </div>

      {/* Recent activity placeholder */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Hoạt động gần đây</h2>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <TrendingUp className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            Chưa có hoạt động nào được ghi nhận
          </p>
        </div>
      </div>
    </div>
  );
}
