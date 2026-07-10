'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, ChevronDown, Building2, Home, Filter as FilterIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { STATUS_LABELS, API_ENDPOINTS, BEDROOM_OPTIONS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

type Project = { id: string; slug: string; name: string; location?: string; towerCount?: number };
type Tower = { id: string; slug: string; name: string; floor?: number; apartmentCount?: number };
type Apartment = {
  id: string; code: string; slug: string; bedroomCount: number; area?: number;
  layoutType?: string; status: string; priceEstimate?: number;
  direction?: string; thumbnailUrl?: string;
};

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [projects, setProjects] = useState<Project[]>([]);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState({ projects: true, towers: false, apartments: false });

  const [selectedProject, setSelectedProject] = useState<string | null>(
    searchParams.get('project')
  );
  const [selectedTower, setSelectedTower] = useState<string | null>(
    searchParams.get('tower')
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filterOpen, setFilterOpen] = useState(true);

  // Fetch projects on mount
  useEffect(() => {
    fetch(API_ENDPOINTS.projects)
      .then((r) => r.json())
      .then((data) => {
        setProjects(data.data || []);
        setLoading((p) => ({ ...p, projects: false }));
      })
      .catch(() => setLoading((p) => ({ ...p, projects: false })));
  }, []);

  // Fetch towers when project changes
  useEffect(() => {
    if (!selectedProject) {
      setTowers([]);
      setSelectedTower(null);
      return;
    }
    setLoading((p) => ({ ...p, towers: true }));
    fetch(`${API_ENDPOINTS.towers}?projectId=${selectedProject}`)
      .then((r) => r.json())
      .then((data) => {
        setTowers(data.data || []);
        setLoading((p) => ({ ...p, towers: false }));
      })
      .catch(() => setLoading((p) => ({ ...p, towers: false })));
  }, [selectedProject]);

  // Fetch apartments when tower changes
  useEffect(() => {
    if (!selectedTower) {
      setApartments([]);
      return;
    }
    setLoading((p) => ({ ...p, apartments: true }));
    fetch(`${API_ENDPOINTS.apartments}?towerId=${selectedTower}${searchQuery ? `&q=${searchQuery}` : ''}`)
      .then((r) => r.json())
      .then((data) => {
        setApartments(data.data || []);
        setLoading((p) => ({ ...p, apartments: false }));
      })
      .catch(() => setLoading((p) => ({ ...p, apartments: false })));
  }, [selectedTower, searchQuery]);

  function updateURL(params: Record<string, string | null>) {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    });
    router.push(url.pathname + url.search, { scroll: false });
  }

  function selectProject(id: string | null) {
    setSelectedProject(id);
    setSelectedTower(null);
    setSearchQuery('');
    updateURL({ project: id, tower: null, q: null });
  }

  function selectTower(id: string | null) {
    setSelectedTower(id);
    setSearchQuery('');
    updateURL({ tower: id, q: null });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateURL({ q: searchQuery || null });
  }

  const statusLabels = STATUS_LABELS;

  return (
    <div className="glass rounded-2xl shadow-strong p-6 md:p-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Tìm mã căn hộ (VD: A3 0703)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 pl-12 pr-4 rounded-xl border-border bg-background/50 text-foreground placeholder:text-muted-foreground"
        />
      </form>

      {/* 3-Level Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Level 1: Project */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
            <Building2 className="h-3 w-3" />
            Dự án
          </label>
          <div className="relative">
            <select
              value={selectedProject || ''}
              onChange={(e) => selectProject(e.target.value || null)}
              className="w-full h-12 rounded-xl border border-input bg-background/50 px-4 pr-10 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
            >
              <option value="">Tất cả dự án</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          {loading.projects && <Skeleton className="h-12 w-full rounded-xl" />}
        </div>

        {/* Level 2: Tower */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
            <Building2 className="h-3 w-3" />
            Tòa nhà
          </label>
          <div className="relative">
            <select
              value={selectedTower || ''}
              onChange={(e) => selectTower(e.target.value || null)}
              disabled={!selectedProject}
              className="w-full h-12 rounded-xl border border-input bg-background/50 px-4 pr-10 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 disabled:opacity-40"
            >
              <option value="">Tất cả tòa</option>
              {towers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          {loading.towers && <Skeleton className="h-12 w-full rounded-xl" />}
        </div>

        {/* Level 3: Quick Bedroom Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
            <Home className="h-3 w-3" />
            Loại căn
          </label>
          <div className="flex gap-2 flex-wrap">
            {BEDROOM_OPTIONS.map((type) => (
              <button
                key={type}
                className="px-4 py-2 rounded-lg text-xs font-medium border transition-all duration-200 border-glass-border text-muted-foreground hover:border-gold/30 hover:text-gold"
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-semibold text-cream">
            {apartments.length > 0
              ? `${apartments.length} căn hộ`
              : 'Kết quả tìm kiếm'}
          </h3>
          {selectedTower && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                selectProject(null);
                selectTower(null);
              }}
              className="text-muted-foreground"
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>

        {/* Apartment Grid */}
        {loading.apartments ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : apartments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apartments.slice(0, 12).map((apt, i) => (
              <motion.a
                key={apt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                href={`/apartment/${apt.slug}`}
                className="group relative rounded-xl border border-glass-border bg-card overflow-hidden hover:border-gold/30 transition-all duration-300 hover:shadow-gold"
              >
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-heading text-lg font-semibold text-cream group-hover:text-gold transition-colors">
                        {apt.code}
                      </h4>
                      <p className="text-xs text-muted-foreground">{apt.layoutType || 'Căn hộ'}</p>
                    </div>
                    {apt.status && (
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-2 py-0.5 ${
                          statusLabels[apt.status]?.color || ''
                        }`}
                      >
                        {statusLabels[apt.status]?.label || apt.status}
                      </Badge>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex gap-4 text-xs text-muted-foreground mb-3">
                    {apt.bedroomCount && (
                      <span className="flex items-center gap-1">
                        <Home className="h-3 w-3" />
                        {apt.bedroomCount} PN
                      </span>
                    )}
                    {apt.area && <span>{apt.area} m²</span>}
                    {apt.direction && <span>Hướng {apt.direction}</span>}
                  </div>

                  {/* Price */}
                  {apt.priceEstimate && (
                    <div className="gold-gradient text-sm font-semibold">
                      {apt.priceEstimate.toLocaleString()} - {(apt.priceEstimate * 1.3).toLocaleString()} VNĐ
                    </div>
                  )}
                </div>
              </motion.a>
            ))}
          </div>
        ) : selectedTower ? (
          <div className="text-center py-12 text-muted-foreground">
            <Home className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Không tìm thấy căn hộ nào</p>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Chọn dự án và tòa nhà để xem danh sách căn hộ</p>
          </div>
        )}
      </div>
    </div>
  );
}
