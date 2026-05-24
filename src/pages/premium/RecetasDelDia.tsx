import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import type { Receta } from '@/types';
import { Clock, ChefHat, Lock, Flame } from 'lucide-react';
import placeholderReceta from '@/assets/recipe/placeholder-recipe.jpg';

const DIFICULTAD_ESTILOS = {
    facil: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
    media: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
    dificil: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
};

export default function RecetasDelDia() {
    const [recetas, setRecetas] = useState<Receta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchRecetas = async () => {
            try {
                const data = await api.get<Receta[]>('/recipes/today');
                if (!cancelled) setRecetas(data);
            } catch {
                if (!cancelled) setError('No se pudieron cargar las recetas del día.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchRecetas();
        return () => { cancelled = true; };
    }, []);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="h-8 w-48 rounded-xl bg-stone-200 dark:bg-stone-800 animate-pulse mb-8" />
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-96 rounded-2xl bg-stone-200 dark:bg-stone-800 animate-pulse" />
                    <div className="flex flex-col gap-4">
                        <div className="h-44 rounded-2xl bg-stone-200 dark:bg-stone-800 animate-pulse" />
                        <div className="h-44 rounded-2xl bg-stone-200 dark:bg-stone-800 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto text-center py-20">
                <p className="text-stone-500 dark:text-stone-400">{error}</p>
            </div>
        );
    }

    const [featured, ...resto] = recetas;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Exclusivo premium</span>
                </div>
                <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">
                    Recetas del día
                </h1>
                <p className="text-stone-500 dark:text-stone-400 mt-1">
                    Selección especial de hoy curada por nuestros chefs.
                </p>
            </div>

            {recetas.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-stone-400">No hay recetas disponibles hoy. Vuelve pronto.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">

                    {featured && (
                        <Link
                            to={`/receta/${featured.id}`}
                            className="group relative rounded-2xl overflow-hidden bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-700 transition-all hover:shadow-md sm:row-span-2"
                        >
                            <div className="relative h-56 sm:h-full min-h-[380px] overflow-hidden">
                                <img
                                    src={featured.imagenUrl ?? placeholderReceta}
                                    alt={featured.titulo}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                {featured.esPremium && (
                                    <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-400 text-amber-950">
                                        <Lock className="w-3 h-3" /> Premium
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DIFICULTAD_ESTILOS[featured.dificultad]} mb-2 inline-block`}>
                                        {featured.dificultad.charAt(0).toUpperCase() + featured.dificultad.slice(1)}
                                    </span>
                                    <p className="text-xs text-stone-300 mb-1">{featured.categoriaNombre}</p>
                                    <h2 className="font-serif text-2xl font-bold text-white mb-3 leading-tight">
                                        {featured.titulo}
                                    </h2>
                                    <p className="text-sm text-stone-300 mb-4 line-clamp-2">{featured.descripcion}</p>
                                    <div className="flex items-center justify-between text-xs text-stone-400">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {featured.tiempoEstimadoMin} min
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <ChefHat className="w-3 h-3" /> {featured.chefNombre}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}

                    {resto.map((receta) => (
                        <Link
                            key={receta.id}
                            to={`/receta/${receta.id}`}
                            className="group bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl overflow-hidden hover:border-amber-300 dark:hover:border-amber-700 transition-all hover:shadow-md"
                        >
                            <div className="relative h-40 overflow-hidden">
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
                                <p className="text-xs text-stone-400 mb-1">{receta.categoriaNombre}</p>
                                <h2 className="font-serif font-semibold text-stone-900 dark:text-stone-100 mb-3 leading-tight">
                                    {receta.titulo}
                                </h2>
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

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">Aprende en vivo</p>
                    <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 mb-1">
                        ¿Quieres dominar estas recetas?
                    </h2>
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                        Agenda una sesión personalizada con uno de nuestros chefs profesionales.
                    </p>
                </div>
                <Link
                    to="/premium/mis-sesiones"
                    className="flex-shrink-0 px-6 py-3 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 rounded-full font-medium text-sm hover:bg-stone-800 dark:hover:bg-amber-400 transition-colors"
                >
                    Agendar sesión →
                </Link>
            </div>
        </div>
    );
}