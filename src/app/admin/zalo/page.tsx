'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, RefreshCw, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface ZaloMessage {
  id: string;
  userId: string;
  userName: string | null;
  messageType: string;
  content: string;
  processed: boolean;
  createdAt: string;
}

export default function AdminZaloPage() {
  const [messages, setMessages] = useState<ZaloMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/admin/zalo-messages?limit=10');
      const json = await res.json();
      setMessages(json.data ?? []);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetch('/api/admin/zalo-sync-logs', { method: 'POST' });
    } catch {}
    setTimeout(() => setSyncing(false), 1000);
  };

  const todayMessages = messages.length;
  const processed = messages.filter((m) => m.processed).length;
  const pending = todayMessages - processed;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageCircle className="h-6 w-6 text-primary" />
        <div className="flex-1">
          <h1 className="text-xl font-semibold tracking-tight">Zalo Bot</h1>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 h-10 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          Đồng bộ ngay
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <div className="rounded-xl border bg-card p-4">
          <Clock className="mb-2 h-5 w-5 text-blue-600" />
          <p className="text-2xl font-bold">{todayMessages}</p>
          <p className="text-xs text-muted-foreground">Hôm nay</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <CheckCircle2 className="mb-2 h-5 w-5 text-emerald-600" />
          <p className="text-2xl font-bold">{processed}</p>
          <p className="text-xs text-muted-foreground">Đã xử lý</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <AlertCircle className="mb-2 h-5 w-5 text-amber-600" />
          <p className="text-2xl font-bold">{pending}</p>
          <p className="text-xs text-muted-foreground">Chờ xử lý</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <RefreshCw className="mb-2 h-5 w-5 text-violet-600" />
          <p className="text-2xl font-bold">{(messages as any).totalPages ?? 1}</p>
          <p className="text-xs text-muted-foreground">Đồng bộ</p>
        </div>
      </div>

      {/* Messages table */}
      <div className="rounded-xl border bg-card">
        <div className="border-b px-6 py-3">
          <h2 className="font-semibold">Tin nhắn gần đây</h2>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-muted" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <MessageCircle className="mb-3 h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Chưa có tin nhắn nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50 text-left text-xs font-medium uppercase text-muted-foreground">
                  <th className="px-6 py-3">Người gửi</th>
                  <th className="px-6 py-3">Loại</th>
                  <th className="px-6 py-3">Nội dung</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {messages.map((msg) => (
                  <tr key={msg.id} className="text-sm hover:bg-muted/30">
                    <td className="px-6 py-3 font-medium">{msg.userName ?? msg.userId}</td>
                    <td className="px-6 py-3 text-muted-foreground">{msg.messageType}</td>
                    <td className="px-6 py-3 max-w-xs truncate text-muted-foreground">
                      {msg.content.slice(0, 80)}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${msg.processed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {msg.processed ? '✅ Đã xử lý' : '⏳ Chờ'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-xs text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
