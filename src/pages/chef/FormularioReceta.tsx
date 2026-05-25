import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import type { Receta, Categoria, Ingrediente, Paso } from '@/types';
import { Plus, X, Loader2, ArrowLeft, ChefHat } from 'lucide-react';

interface FormularioRecetaProps {
    recetaInicial?: Receta;
    modo: 'crear' | 'editar';
}

export default function FormularioReceta({ recetaInicial, modo }: FormularioRecetaProps) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categorias, setCategorias] = useState<Categoria[]>([]);

    const [titulo, setTitulo] = useState(recetaInicial?.titulo ?? '');
    const [descripcion, setDescripcion] = useState(recetaInicial?.descripcion ?? '');
    const [categoriaId, setCategoriaId] = useState(recetaInicial?.categoriaId ?? '');
    const [tiempoEstimadoMin, setTiempoEstimadoMin] = useState(recetaInicial?.tiempoEstimadoMin ?? 30);
    const [dificultad, setDificultad] = useState<'facil' | 'media' | 'dificil'>(recetaInicial?.dificultad ?? 'facil');
    const [esPremium, setEsPremium] = useState(recetaInicial?.esPremium ?? false);
    const [imagenUrl, setImagenUrl] = useState(recetaInicial?.imagenUrl ?? '');
    const [videoUrl, setVideoUrl] = useState(recetaInicial?.videoUrl ?? '');
    const [ingredientes, setIngredientes] = useState<Ingrediente[]>(
        recetaInicial?.ingredientes ?? [{ nombre: '', cantidad: '', unidad: '' }]
    );
    const [pasos, setPasos] = useState<Paso[]>(
        recetaInicial?.pasos ?? [{ orden: 1, descripcion: '', tiempoMin: undefined }]
    );

    useEffect(() => {
        let cancelled = false;
        api.get<{ data: Categoria[] }>('/categories')
            .then(data => { if (!cancelled) setCategorias(data.data); })
            .catch(() => null);
        return () => { cancelled = true; };
    }, []);

    const agregarIngrediente = () => {
        setIngredientes(prev => [...prev, { nombre: '', cantidad: '', unidad: '' }]);
    };

    const eliminarIngrediente = (i: number) => {
        setIngredientes(prev => prev.filter((_, j) => j !== i));
    };

    const actualizarIngrediente = (i: number, campo: keyof Ingrediente, valor: string) => {
        setIngredientes(prev => prev.map((ing, j) => j === i ? { ...ing, [campo]: valor } : ing));
    };

    const agregarPaso = () => {
        setPasos(prev => [...prev, { orden: prev.length + 1, descripcion: '', tiempoMin: undefined }]);
    };

    const eliminarPaso = (i: number) => {
        setPasos(prev => prev.filter((_, j) => j !== i).map((p, j) => ({ ...p, orden: j + 1 })));
    };

    const actualizarPaso = (i: number, campo: keyof Paso, valor: string | number | undefined) => {
        setPasos(prev => prev.map((paso, j) => j === i ? { ...paso, [campo]: valor } : paso));
    };

    const handleSubmit = async () => {
        if (!titulo.trim() || !descripcion.trim() || !categoriaId) {
            setError('Título, descripción y categoría son requeridos.');
            return;
        }
        if (ingredientes.some(i => !i.nombre.trim())) {
            setError('Todos los ingredientes deben tener nombre.');
            return;
        }
        if (pasos.some(p => !p.descripcion.trim())) {
            setError('Todos los pasos deben tener descripción.');
            return;
        }

        setLoading(true);
        setError(null);

        const payload = {
            titulo,
            descripcion,
            categoriaId,
            tiempoEstimadoMin,
            dificultad,
            esPremium,
            imagenUrl: imagenUrl || null,
            videoUrl: videoUrl || null,
            ingredientes,
            pasos,
        };

        try {
            if (modo === 'crear') {
                await api.post('/recipes', payload);
            } else {
                await api.patch(`/recipes/${recetaInicial!.id}`, payload);
            }
            navigate('/chef/mis-recetas');
        } catch {
            setError('No se pudo guardar la receta. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Volver
            </button>

            <div className="flex items-center gap-2 mb-1">
                <ChefHat className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Chef</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100 mb-8">
                {modo === 'crear' ? 'Nueva receta' : 'Editar receta'}
            </h1>

            <div className="space-y-4">
                <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-6">
                    <h2 className="font-serif text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">Información básica</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Título</label>
                            <input
                                type="text"
                                value={titulo}
                                onChange={e => setTitulo(e.target.value)}
                                placeholder="Nombre de la receta"
                                className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400 dark:focus:border-amber-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Descripción</label>
                            <textarea
                                value={descripcion}
                                onChange={e => setDescripcion(e.target.value)}
                                placeholder="Describe tu receta"
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 resize-none"
                            />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Categoría</label>
                                <select
                                    value={categoriaId}
                                    onChange={e => setCategoriaId(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 text-sm focus:outline-none focus:border-amber-400 dark:focus:border-amber-500"
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categorias.map(c => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Tiempo estimado (min)</label>
                                <input
                                    type="number"
                                    value={tiempoEstimadoMin}
                                    onChange={e => setTiempoEstimadoMin(Number(e.target.value))}
                                    min={1}
                                    className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 text-sm focus:outline-none focus:border-amber-400 dark:focus:border-amber-500"
                                />
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Dificultad</label>
                                <select
                                    value={dificultad}
                                    onChange={e => setDificultad(e.target.value as 'facil' | 'media' | 'dificil')}
                                    className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 text-sm focus:outline-none focus:border-amber-400 dark:focus:border-amber-500"
                                >
                                    <option value="facil">Fácil</option>
                                    <option value="media">Media</option>
                                    <option value="dificil">Difícil</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3">
                                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Receta Premium</label>
                                <button
                                    onClick={() => setEsPremium(p => !p)}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${esPremium ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-600'}`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${esPremium ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-serif text-lg font-semibold text-stone-800 dark:text-stone-100">Ingredientes</h2>
                        <button
                            onClick={agregarIngrediente}
                            className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Agregar
                        </button>
                    </div>
                    <div className="space-y-3">
                        {ingredientes.map((ing, i) => (
                            <div key={i} className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={ing.nombre}
                                    onChange={e => actualizarIngrediente(i, 'nombre', e.target.value)}
                                    placeholder="Nombre"
                                    className="flex-1 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400"
                                />
                                <input
                                    type="text"
                                    value={ing.cantidad}
                                    onChange={e => actualizarIngrediente(i, 'cantidad', e.target.value)}
                                    placeholder="Cantidad"
                                    className="w-24 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400"
                                />
                                <input
                                    type="text"
                                    value={ing.unidad}
                                    onChange={e => actualizarIngrediente(i, 'unidad', e.target.value)}
                                    placeholder="Unidad"
                                    className="w-24 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400"
                                />
                                <button
                                    onClick={() => eliminarIngrediente(i)}
                                    disabled={ingredientes.length === 1}
                                    className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-30"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-serif text-lg font-semibold text-stone-800 dark:text-stone-100">Preparación</h2>
                        <button
                            onClick={agregarPaso}
                            className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Agregar paso
                        </button>
                    </div>
                    <div className="space-y-4">
                        {pasos.map((paso, i) => (
                            <div key={i} className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Paso {paso.orden}</span>
                                    <button
                                        onClick={() => eliminarPaso(i)}
                                        disabled={pasos.length === 1}
                                        className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-30"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <textarea
                                    value={paso.descripcion}
                                    onChange={e => actualizarPaso(i, 'descripcion', e.target.value)}
                                    placeholder="Describe este paso..."
                                    rows={2}
                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400 resize-none mb-2"
                                />
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-stone-400">Tiempo (min):</label>
                                    <input
                                        type="number"
                                        value={paso.tiempoMin ?? ''}
                                        onChange={e => actualizarPaso(i, 'tiempoMin', e.target.value ? Number(e.target.value) : undefined)}
                                        placeholder="Opcional"
                                        min={1}
                                        className="w-24 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-6">
                    <h2 className="font-serif text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">Multimedia</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">URL de imagen</label>
                            <input
                                type="url"
                                value={imagenUrl}
                                onChange={e => setImagenUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400 dark:focus:border-amber-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">URL de video (opcional)</label>
                            <input
                                type="url"
                                value={videoUrl}
                                onChange={e => setVideoUrl(e.target.value)}
                                placeholder="https://youtube.com/..."
                                className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400 dark:focus:border-amber-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mt-4 text-sm text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            <div className="flex gap-3 mt-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex-1 py-3 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-2xl font-medium text-sm hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors border border-stone-200 dark:border-stone-700"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-3 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 rounded-2xl font-medium text-sm hover:bg-stone-800 dark:hover:bg-amber-400 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Guardando...' : modo === 'crear' ? 'Publicar receta' : 'Guardar cambios'}
                </button>
            </div>
        </div>
    );
}