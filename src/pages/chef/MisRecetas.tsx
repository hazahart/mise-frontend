import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import type { RecetaResumen } from '@/types';
import { ChefHat, Clock, Plus, Pencil, Trash2, Loader2, Lock } from 'lucide-react';
import placeholderReceta from '@/assets/recipe/placeholder-recipe.jpg';

const DIFICULTAD_ESTILOS = {
    facil: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
    media: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
    dificil: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
};

export default function MisRecetas() {
    const [recetas, setRecetas] = useState<RecetaResumen[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [eliminando, setEliminando] = useState<string | null>(null);
    const [confirmarEliminar, setConfirmarEliminar] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchRecetas = async () => {
            try {
                const data = await api.get<RecetaResumen[]>('/recipes/chef/mis-recetas');
                if (!cancelled) setRecetas(data);
            } catch {
                if (!cancelled) setError('No se pudieron cargar las recetas.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchRecetas();
        return () => { cancelled = true; };
    }, []);

    const handleEliminar = async (id: string) => {
        setEliminando(id);
        try {
            await api.delete(`/recipes/${id}`);
            setRecetas(prev => prev.filter(r => r.id !== id));
            setConfirmarEliminar(null);
        } catch {
            setError('No se pudo eliminar la receta.');
        } finally {
            setEliminando(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <ChefHat className="w-5 h-5 text-amber-500" />
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Chef</span>
                    </div>
                    <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">Mis recetas</h1>
                    <p className="text-stone-500 dark:text-stone-400 mt-1">Administra tus recetas publicadas.</p>
                </div>
                <Link
                    to="/chef/nueva-receta"
                    className="flex items-center gap-2 px-4 py-2 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 rounded-xl text-sm font-medium hover:bg-stone-800 dark:hover:bg-amber-400 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Nueva receta
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 text-sm text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            {recetas.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl">
                    <ChefHat className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
                    <p className="text-stone-400 mb-4">No tienes recetas publicadas aún.</p>
                    <Link
                        to="/chef/nueva-receta"
                        className="text-amber-600 dark:text-amber-400 text-sm font-medium hover:underline"
                    >
                        Crear tu primera receta →
                    </Link>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recetas.map((receta) => (
                        <div
                            key={receta.id}
                            className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl overflow-hidden"
                        >
                            <div className="relative h-44 overflow-hidden">
                                <img
                                    src={receta.imagenUrl ?? placeholderReceta}
                                    alt={receta.titulo}
                                    className="w-full h-full object-cover"
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
                                <p className="text-xs text-stone-400 mb-1">{receta.categoriaNombre}</p>
                                <h2 className="font-serif font-semibold text-stone-900 dark:text-stone-100 mb-2 leading-tight">
                                    {receta.titulo}
                                </h2>
                                <div className="flex items-center gap-3 text-xs text-stone-400 mb-4">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {receta.tiempoEstimadoMin} min
                                    </span>
                                    <span>{receta.totalIngredientes} ingredientes</span>
                                </div>

                                {confirmarEliminar === receta.id ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEliminar(receta.id)}
                                            disabled={eliminando === receta.id}
                                            className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-medium transition-colors disabled:opacity-50"
                                        >
                                            {eliminando === receta.id ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : 'Confirmar'}
                                        </button>
                                        <button
                                            onClick={() => setConfirmarEliminar(null)}
                                            className="flex-1 py-2 bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-medium transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/chef/editar/${receta.id}`}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-medium hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors"
                                        >
                                            <Pencil className="w-3.5 h-3.5" /> Editar
                                        </Link>
                                        <button
                                            onClick={() => setConfirmarEliminar(receta.id)}
                                            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-xl text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}