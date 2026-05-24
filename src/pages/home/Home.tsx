import {useQuery} from '@tanstack/react-query';
import {Link} from 'react-router-dom';
import {api} from '@/lib/api';
import type {Categoria, RecetaResumen} from '@/types';
import {Clock, ChefHat, Lock} from 'lucide-react';
import placeholderReceta from '@/assets/recipe/placeholder-recipe.jpg';
import placeholderCategoria from '@/assets/category/placeholder-categoria.jpg';

const DIFICULTAD_ESTILOS = {
    facil: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
    media: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
    dificil: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
};

export default function Home() {
    const {data: categorias, isLoading: loadingCats} = useQuery({
        queryKey: ['categorias'],
        queryFn: () => api.get<Categoria[]>('/categories'),
    });

    const {data: recetasData, isLoading: loadingRecetas} = useQuery({
        queryKey: ['recetas'],
        queryFn: () => api.get<{ data: RecetaResumen[]; total: number }>('/recipes?limit=6'),
    });

    return (
        <div className="max-w-6xl mx-auto">

            <div
                className="rounded-2xl bg-stone-900 dark:bg-stone-800 p-12 mb-10 flex items-center justify-between overflow-hidden relative">
                <div className="relative z-10">
                    <h1 className="font-serif text-4xl font-bold text-stone-100 leading-tight mb-3">
                        Cocina como chef,<br/>
                        <span className="italic text-amber-400">come como rey</span>
                    </h1>
                    <p className="text-stone-400 text-base max-w-md mb-6 leading-relaxed">
                        Descubre cientos de recetas curadas por chefs profesionales.
                    </p>
                    <div className="flex gap-3">
                        <Link to="/categorias"
                              className="px-6 py-3 bg-white text-stone-900 rounded-full text-sm font-medium hover:bg-stone-100 transition-colors">
                            Explorar recetas
                        </Link>
                        <Link to="/suscripcion"
                              className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-full text-sm font-medium hover:bg-white/20 transition-colors">
                            Ver planes
                        </Link>
                    </div>
                </div>
                <div className="text-8xl hidden md:block">🍽️</div>
            </div>

            <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-2xl font-semibold text-stone-800 dark:text-stone-100">Categorías</h2>
                <Link to="/categorias"
                      className="text-sm text-amber-600 dark:text-amber-400 font-medium hover:underline">Ver todas
                    →</Link>
            </div>

            {loadingCats ? (
                <div className="grid grid-cols-6 gap-3 mb-10">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-28 rounded-2xl bg-stone-200 dark:bg-stone-800 animate-pulse"/>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
                    {(categorias ?? []).map(cat => (
                        <Link
                            key={cat.id}
                            to={`/categoria/${cat.id}`}
                            className="rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700"
                        >
                            <div className="h-20 w-full overflow-hidden">
                                <img
                                    src={cat.imagenUrl ?? placeholderCategoria}
                                    alt={cat.nombre}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-2 text-center">
                                <div
                                    className="text-sm font-medium text-stone-700 dark:text-stone-200">{cat.nombre}</div>
                                <div className="text-xs text-stone-400 mt-0.5">{cat.totalRecetas} recetas</div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-2xl font-semibold text-stone-800 dark:text-stone-100">Recetas
                    destacadas</h2>
                <Link to="/categorias"
                      className="text-sm text-amber-600 dark:text-amber-400 font-medium hover:underline">Ver todas
                    →</Link>
            </div>

            {loadingRecetas ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-64 rounded-2xl bg-stone-200 dark:bg-stone-800 animate-pulse"/>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                    {(recetasData?.data ?? []).map(receta => (
                        <Link
                            key={receta.id}
                            to={`/receta/${receta.id}`}
                            className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="h-44 overflow-hidden">
                                <img
                                    src={receta.imagenUrl ?? placeholderReceta}
                                    alt={receta.titulo}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                  <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${DIFICULTAD_ESTILOS[receta.dificultad]}`}>
                    {receta.dificultad.charAt(0).toUpperCase() + receta.dificultad.slice(1)}
                  </span>
                                    {receta.esPremium && (
                                        <span
                                            className="ml-auto flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                      <Lock className="w-3 h-3"/> Pro
                    </span>
                                    )}
                                </div>
                                <h3 className="font-serif text-base font-semibold text-stone-800 dark:text-stone-100 mb-2 leading-snug">
                                    {receta.titulo}
                                </h3>
                                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="flex items-center gap-1">
                    <ChefHat className="w-3.5 h-3.5"/> {receta.chefNombre}
                  </span>
                                    <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5"/> {receta.tiempoEstimadoMin} min
                  </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <div className="rounded-2xl bg-amber-400 dark:bg-amber-500 p-8 flex items-center justify-between mb-8">
                <div>
                    <p className="text-xs font-semibold text-amber-900 uppercase tracking-widest mb-1">Plan Premium</p>
                    <h3 className="font-serif text-2xl font-bold text-amber-950 mb-1">Desbloquea todo el potencial</h3>
                    <p className="text-amber-800 text-sm">Recetas exclusivas, sugeridor IA, chat con chefs y más</p>
                </div>
                <Link
                    to="/suscripcion"
                    className="px-7 py-3 bg-amber-950 text-amber-50 rounded-full text-sm font-medium whitespace-nowrap hover:bg-amber-900 transition-colors"
                >
                    Ver planes →
                </Link>
            </div>

        </div>
    );
}