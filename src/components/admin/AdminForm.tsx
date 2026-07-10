'use client';

import { useState, type FormEvent } from 'react';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface AdminFormProps {
  title: string;
  backHref: string;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  children: React.ReactNode;
  submitLabel?: string;
}

export function AdminForm({
  title,
  backHref,
  onSubmit,
  loading: externalLoading,
  error,
  children,
  submitLabel = 'Lưu',
}: AdminFormProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = externalLoading ?? internalLoading;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setInternalLoading(true);
    try {
      const form = e.currentTarget as HTMLFormElement;
      const formData = new FormData(form);
      const data: Record<string, unknown> = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      await onSubmit(data);
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={backHref}
          className="rounded-lg border p-2 text-muted-foreground transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {children}

        <div className="flex justify-end gap-3 border-t pt-6">
          <Link
            href={backHref}
            className="inline-flex h-10 items-center rounded-lg border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
