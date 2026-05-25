import FormularioReceta from './FormularioReceta';

export default function NuevaReceta() {
    return <FormularioReceta modo="crear" />;
}

git add .
git commit -m "tu commit"
gut push origin feature/panel-chef

Archivo: src/pages/chef/EditarReceta.tsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import type { Receta } from '@/types';
import FormularioReceta from './FormularioReceta';
import { Loader2 } from 'lucide-react';

export default function EditarReceta() {
    const { id } = useParams<{ id: string }>();
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
            } catch {
                if (!cancelled) setError('No se pudo cargar la receta.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchReceta();
        return () => { cancelled = true; };
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
            </div>
        );
    }

    if (error || !receta) {
        return (
            <div className="text-center py-20">
                <p className="text-stone-400">{error ?? 'Receta no encontrada.'}</p>
            </div>
        );
    }

    return <FormularioReceta modo="editar" recetaInicial={receta} />;
}