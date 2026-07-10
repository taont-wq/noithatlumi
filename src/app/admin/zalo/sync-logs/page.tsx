'use client';

import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { DataTable, type Column } from '@/components/admin/DataTable';

interface SyncLog {
  id: string;
  triggerType: string;
  status: string;
  stats: string;
  error: string | null;
  startedAt: string;
  completedAt: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  RUNNING: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  FAILED: 'bg-rose-100 text-rose-700',
  PARTIAL: 'bg-amber-100 text-amber-700',
};

const STATUS_LABELS2: Record<string, string> = {
  PENDING: 'Chờ', RUNNING: 'Đang chạy', COMPLETED: 'Hoàn tất',
  FAILED: 'Thất bại', PARTIAL: 'Một phần',
};

const TRIGGER_LABELS: Record<string, string> = {
  WEBHOOK: 'Webhook', CRON: 'Cron', MANUAL: 'Thủ công', ZALO_BOT_COMMAND: 'Lệnh Zalo',
};

export default function AdminZaloSyncLogsPage() {
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/zalo-sync-logs');
      const json = await res.json();
      setLogs(json.data ?? []);
    } catch { setLogs([]); } finally { setLoading(false); }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetch('/api/admin/zalo-sync-logs', { method: 'POST' });
      await new Promise((r) => setTimeout(r, 500));
      fetchLogs();
    } catch {}
    setSyncing(false);
  };

  const columns: Column<SyncLog>[] = [
    {
      key: 'triggerType',
      label: 'Loại',
      render: (l) => TRIGGER_LABELS[l.triggerType] ?? l.triggerType,
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (l) => (
        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[l.status] ?? 'bg-gray-100 text-gray-700'}`}>
          {STATUS_LABELS2[l.status] ?? l.status}
        </span>
      ),
    },
    {
      key: 'startedAt',
      label: 'Bắt đầu',
      render: (l) => new Date(l.startedAt).toLocaleString('vi-VN'),
      sortable: true,
    },
    {
      key: 'completedAt',
      label: 'Kết thúc',
      render: (l) => l.completedAt ? new Date(l.completedAt).toLocaleString('vi-VN') : '—',
    },
    { key: 'error', label: 'Lỗi', render: (l) => l.error ?? '—' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <RefreshCw className="h-6 w-6 text-primary" />
        <div className="flex-1">
          <h1 className="text-xl font-semibold tracking-tight">Lịch sử đồng bộ</h1>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 h-10 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          Đồng bộ
        </button>
      </div>

      <DataTable
        columns={columns}
        data={logs}
        keyField="id"
        loading={loading}
      />
    </div>
  );
}
