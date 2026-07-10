'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Loader2 } from 'lucide-react';

interface SettingRow {
  key: string;
  label: string;
  value: string;
  group: string;
}

const DEFAULT_SETTINGS: SettingRow[] = [
  { key: 'site_name', label: 'Tên trang web', value: 'Lumi Design', group: 'Thông tin chung' },
  { key: 'site_description', label: 'Mô tả trang web', value: 'Tra cứu nội thất căn hộ cao cấp', group: 'Thông tin chung' },
  { key: 'hotline', label: 'Hotline', value: '058 929 4444', group: 'Thông tin chung' },
  { key: 'meta_title', label: 'Meta Title mặc định', value: 'Lumi Design - Nội thất căn hộ cao cấp', group: 'SEO' },
  { key: 'meta_description', label: 'Meta Description mặc định', value: 'Khám phá nội thất căn hộ cao cấp tại Lumi Design', group: 'SEO' },
  { key: 'zalo_oa_id', label: 'Zalo OA ID', value: '********', group: 'Tích hợp' },
  { key: 'facebook_url', label: 'Facebook URL', value: 'https://facebook.com/NoithatNewhomes', group: 'Tích hợp' },
  { key: 'youtube_url', label: 'YouTube URL', value: 'https://youtube.com/', group: 'Tích hợp' },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingRow[]>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // TODO: connect to /api/admin/settings when ready
  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((json) => {
        if (json.data) {
          setSettings((prev) =>
            prev.map((s) => ({
              ...s,
              value: json.data.find((d: SettingRow) => d.key === s.key)?.value ?? s.value,
            }))
          );
        }
      })
      .catch(() => {
        // API not ready yet — use defaults
      });
  }, []);

  const handleSave = async (key: string) => {
    setSaving(key);
    // TODO: POST /api/admin/settings when API is ready
    await new Promise((r) => setTimeout(r, 300));
    setSaving(null);
    setToast(`Đã lưu: ${key}`);
    setTimeout(() => setToast(null), 2000);
  };

  const updateValue = (key: string, value: string) => {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
  };

  const groups = settings.reduce<Record<string, SettingRow[]>>((acc, s) => {
    if (!acc[s.group]) acc[s.group] = [];
    acc[s.group].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-lg border bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Cài đặt hệ thống</h1>
          <p className="text-sm text-muted-foreground">Quản lý cấu hình chung</p>
        </div>
      </div>

      {Object.entries(groups).map(([groupName, items]) => (
        <div key={groupName} className="rounded-lg border bg-card">
          <div className="border-b px-6 py-3">
            <h2 className="font-semibold">{groupName}</h2>
          </div>
          <div className="divide-y">
            {items.map((item) => (
              <div key={item.key} className="flex items-center gap-4 px-6 py-4">
                <div className="flex-1">
                  <label
                    htmlFor={`setting-${item.key}`}
                    className="mb-1 block text-sm font-medium"
                  >
                    {item.label}
                  </label>
                  <input
                    id={`setting-${item.key}`}
                    value={item.value}
                    onChange={(e) => updateValue(item.key, e.target.value)}
                    className="flex h-10 w-full max-w-md rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleSave(item.key)}
                  disabled={saving === item.key}
                  className="mt-5 inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors hover:bg-muted disabled:opacity-50"
                >
                  {saving === item.key ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <p className="text-xs text-muted-foreground">
        * Cài đặt sẽ được lưu vào database. Tính năng này đang được phát triển.
      </p>
    </div>
  );
}
