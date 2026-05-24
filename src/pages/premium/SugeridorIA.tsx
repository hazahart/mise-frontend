import { useState } from 'react';
import { api } from '@/lib/api';
import type { Receta } from '@/types';
import { Sparkles, X, Plus, Clock, ChefHat, Loader2, WandSparkles } from 'lucide-react';

const DIFICULTAD_ESTILOS = {
    facil: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
    media: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
    dificil: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
};

export default function SugeridorIA() {
    const [ingrediente, setIngrediente] = useState('');
    const [ingredientes, setIngredientes] = useState<string[]>([]);
    const [restriccion, setRestriccion] = useState('');
    const [restricciones, setRestricciones] = useState<string[]>([]);
    const [porciones, setPorciones] = useState(2);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [receta, setReceta] = useState<Receta | null>(null);

    const agregarIngrediente = () => {
        const val = ingrediente.trim().toLowerCase();
        if (val && !ingredientes.includes(val)) {
            setIngredientes(prev => [...prev, val]);
        }
        setIngrediente('');
    };

    const agregarRestriccion = () => {
        const val = restriccion.trim().toLowerCase();
        if (val && !restricciones.includes(val)) {
            setRestricciones(prev => [...prev, val]);
        }
        setRestriccion('');
    };

    const handleSugerir = async () => {
        if (ingredientes.length === 0) {
            setError('Agrega al menos un ingrediente.');
            return;
        }
        setLoading(true);
        setError(null);
        setReceta(null);

        try {
            const data = await api.post<Receta>('/ai/suggest-recipe', {
                ingredientes,
                restricciones: restricciones.length > 0 ? restricciones : undefined,
                porciones,
            });
            setReceta(data);
        } catch {
            setError('No se pudo generar la receta. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const pasosOrdenados = receta ? [...receta.pasos].sort((a, b) => a.orden - b.orden) : [];

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Inteligencia artificial</span>
                </div>
                <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">
                    Sugeridor de recetas
                </h1>
                <p className="text-stone-500 dark:text-stone-400 mt-1">
                    Dinos qué ingredientes tienes y la IA creará una receta personalizada para ti.
                </p>
            </div>

            <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-6 mb-6">
                <h2 className="font-serif text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">Ingredientes disponibles</h2>

                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={ingrediente}
                        onChange={e => setIngrediente(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && agregarIngrediente()}
                        placeholder="ej: pollo, limón, ajo..."
                        className="flex-1 px-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400 dark:focus:border-amber-500"
                    />
                    <button
                        onClick={agregarIngrediente}
                        className="px-4 py-2 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 rounded-xl text-sm font-medium hover:bg-stone-800 dark:hover:bg-amber-400 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                {ingredientes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {ingredientes.map((ing, i) => (
                            <span key={i} className="flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-full text-sm">
                                {ing}
                                <button onClick={() => setIngredientes(prev => prev.filter((_, j) => j !== i))}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-6">
                    <h2 className="font-serif text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">Restricciones</h2>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={restriccion}
                            onChange={e => setRestriccion(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && agregarRestriccion()}
                            placeholder="ej: sin gluten, vegano..."
                            className="flex-1 px-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400 dark:focus:border-amber-500"
                        />
                        <button
                            onClick={agregarRestriccion}
                            className="px-4 py-2 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 rounded-xl text-sm font-medium hover:bg-stone-800 dark:hover:bg-amber-400 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    {restricciones.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {restricciones.map((r, i) => (
                                <span key={i} className="flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 rounded-full text-sm">
                                    {r}
                                    <button onClick={() => setRestricciones(prev => prev.filter((_, j) => j !== i))}>
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-6">
                    <h2 className="font-serif text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">Porciones</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setPorciones(p => Math.max(1, p - 1))}
                            className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 font-bold transition-colors"
                        >
                            -
                        </button>
                        <span className="text-2xl font-bold text-stone-800 dark:text-stone-100 w-8 text-center">{porciones}</span>
                        <button
                            onClick={() => setPorciones(p => Math.min(20, p + 1))}
                            className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 font-bold transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 text-sm text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            <button
                onClick={handleSugerir}
                disabled={loading || ingredientes.length === 0}
                className="w-full py-4 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 rounded-2xl font-semibold text-base hover:bg-stone-800 dark:hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-8"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generando receta...
                    </>
                ) : (
                    <>
                        <WandSparkles className="w-5 h-5" />
                        Sugerir receta
                    </>
                )}
            </button>

            {receta && (
                <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl overflow-hidden">
                    <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 p-6">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${DIFICULTAD_ESTILOS[receta.dificultad]}`}>
                                {receta.dificultad.charAt(0).toUpperCase() + receta.dificultad.slice(1)}
                            </span>
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">{receta.titulo}</h2>
                        <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">{receta.descripcion}</p>
                        <div className="flex items-center gap-6 mt-4 text-sm text-stone-500 dark:text-stone-400">
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-amber-500" /> {receta.tiempoEstimadoMin} min
                            </span>
                            <span className="flex items-center gap-1">
                                <ChefHat className="w-4 h-4 text-amber-500" /> {receta.ingredientes.length} ingredientes
                            </span>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 p-6">
                        <div>
                            <h3 className="font-serif text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">Ingredientes</h3>
                            <ul className="space-y-2">
                                {receta.ingredientes.map((ing, i) => (
                                    <li key={i} className="flex items-center justify-between text-sm border-b border-stone-100 dark:border-stone-700 pb-2 last:border-0 last:pb-0">
                                        <span className="text-stone-700 dark:text-stone-300">{ing.nombre}</span>
                                        <span className="text-stone-400 font-medium">{ing.cantidad} {ing.unidad}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-serif text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">Preparación</h3>
                            <ol className="space-y-4">
                                {pasosOrdenados.map((paso, i) => (
                                    <li key={i} className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center justify-center mt-0.5">
                                            {paso.orden}
                                        </span>
                                        <div>
                                            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{paso.descripcion}</p>
                                            {paso.tiempoMin && (
                                                <p className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {paso.tiempoMin} min
                                                </p>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}