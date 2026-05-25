import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import type { Categoria, RecetaResumen } from '@/types';
import { Clock, ChefHat, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import placeholderReceta from '@/assets/recipe/placeholder-recipe.jpg';
import placeholderCategoria from '@/assets/category/placeholder-categoria.jpg';

const DIFICULTAD_ESTILOS = {
    facil: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
    media: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
    dificil: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
};

export default function Categoria() {
    const { id } = useParams<{ id: string }>();
    const [categoria, setCategoria] = useState<Categoria | null>(null);
    const [recetas, setRecetas] = useState<RecetaResumen[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        let cancelled = false;

        const fetchData = async () => {
            try {
                const [cat, recetasData] = await Promise.all([
                    api.get<Categoria>(`/categories/${id}`),
                    api.get<{ data: RecetaResumen[] }>(`/recipes?categoriaId=${id}&limit=20`),
                ]);
                if (!cancelled) {
                    setCategoria(cat);
                    setRecetas(recetasData.data);
                }
            } catch {
                if (!cancelled) setLoading(false);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchData();
        return () => { cancelled = true; };
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <Link
                to="/categorias"
                className="inline-flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Categorías
            </Link>

            {categoria && (
                <div className="relative h-48 rounded-2xl overflow-hidden mb-8">
                    <img
                        src={categoria.imagenUrl ?? placeholderCategoria}
                        alt={categoria.nombre}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                        <h1 className="font-serif text-3xl font-bold text-white mb-1">{categoria.nombre}</h1>
                        <p className="text-stone-300 text-sm">{categoria.descripcion}</p>
                        <p className="text-amber-400 text-xs font-medium mt-1">{categoria.totalRecetas} recetas</p>
                    </div>
                </div>
            )}

            {recetas.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl">
                    <p className="text-stone-400">No hay recetas en esta categoría aún.</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recetas.map(receta => (
                        <Link
                            key={receta.id}
                            to={`/receta/${receta.id}`}
                            className="group bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl overflow-hidden hover:border-amber-300 dark:hover:border-amber-700 transition-all hover:shadow-md"
                        >
                            <div className="relative h-44 overflow-hidden">
                                <img
                                    src={receta.imagenUrl ?? placeholderReceta}
                                    alt={receta.titulo}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                {receta.esPremium && (
                                    <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-400 text-amber-950">
                                        <Lock className="w-3 h-3" /> Premium
                                    </div>
                                )}
                                <span className={`absolute bottom-3 left-3 text-xs font-medium px-2 py-0.5 rounded-full ${DIFICULTAD_ESTILOS[receta.dificultad]}`}>
                                    {receta.dificultad.charAt(0).toUpperCase() + receta.dificultad.slice(1)}
                                </span>
                            </div>
                            <div className="p-4">
                                <h2 className="font-serif font-semibold text-stone-900 dark:text-stone-100 mb-3 leading-tight">{receta.titulo}</h2>
                                <div className="flex items-center justify-between text-xs text-stone-400">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {receta.tiempoEstimadoMin} min
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <ChefHat className="w-3 h-3" /> {receta.chefNombre}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}