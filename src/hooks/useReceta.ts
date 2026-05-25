import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { Receta } from '../types';

export const useReceta = (id: string | undefined) => {
  const [receta, setReceta] = useState<Receta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const fetchReceta = async () => {
      try {
        const data = await api.get<Receta>(`/recipes/${id}`);
        if (!cancelled) setReceta(data);
      } catch (err: unknown) {
        if (!cancelled) {
          const e = err as { code?: string };
          setError(e.code === 'forbidden' ? 'forbidden' : 'error');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchReceta();
    return () => { cancelled = true; };
  }, [id]);

  return { receta, loading, error };
};