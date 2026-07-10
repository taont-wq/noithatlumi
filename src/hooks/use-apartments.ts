import { useQuery } from '@tanstack/react-query';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      const json = await res.json();
      return json.data;
    },
  });
}

export function useTowers(projectId: string | null) {
  return useQuery({
    queryKey: ['towers', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const res = await fetch(`/api/towers?projectId=${projectId}`);
      if (!res.ok) throw new Error('Failed to fetch towers');
      const json = await res.json();
      return json.data;
    },
    enabled: !!projectId,
  });
}

export function useApartments(params: {
  towerId?: string | null;
  projectId?: string | null;
  q?: string;
  bedroomCount?: number;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params.towerId) searchParams.set('towerId', params.towerId);
  if (params.projectId) searchParams.set('projectId', params.projectId);
  if (params.q) searchParams.set('q', params.q);
  if (params.bedroomCount) searchParams.set('bedroomCount', String(params.bedroomCount));
  if (params.status) searchParams.set('status', params.status);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));

  const queryString = searchParams.toString();

  return useQuery({
    queryKey: ['apartments', queryString],
    queryFn: async () => {
      const res = await fetch(`/api/apartments?${queryString}`);
      if (!res.ok) throw new Error('Failed to fetch apartments');
      return res.json();
    },
    enabled: !!params.towerId || !!params.projectId || !!params.q,
  });
}

export function useApartment(slug: string) {
  return useQuery({
    queryKey: ['apartment', slug],
    queryFn: async () => {
      const res = await fetch(`/api/apartments/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch apartment');
      const json = await res.json();
      return json.data;
    },
    enabled: !!slug,
  });
}
