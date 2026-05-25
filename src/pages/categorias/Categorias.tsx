import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import type { Categoria } from '@/types';
import { Grid2X2, Loader2 } from 'lucide-react';
import placeholderCategoria from '@/assets/category/placeholder-categoria.jpg';

export default function Categorias() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        api.get<Categoria[]>('/categories')
            .then(data => { if (!cancelled) setCategorias(data); })
            .catch(() => null)
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <Grid2X2 className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Explorar</span>
                </div>
                <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">Categorías</h1>
                <p className="text-stone-500 dark:text-stone-400 mt-1">Explora recetas por tipo de cocina.</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {categorias.map(cat => (
                        <Link
                            key={cat.id}
                            to={`/categoria/${cat.id}`}
                            className="group bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl overflow-hidden hover:border-amber-300 dark:hover:border-amber-700 transition-all hover:shadow-md"
                        >
                            <div className="h-36 overflow-hidden">
                                <img
                                    src={cat.imagenUrl ?? placeholderCategoria}
                                    alt={cat.nombre}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-4">
                                <h2 className="font-serif font-semibold text-stone-900 dark:text-stone-100">{cat.nombre}</h2>
                                <p className="text-xs text-stone-400 mt-1">{cat.descripcion}</p>
                                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-2">{cat.totalRecetas} recetas</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}