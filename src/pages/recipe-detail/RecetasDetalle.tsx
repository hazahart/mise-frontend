import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useReceta } from '../../hooks/useReceta';
import { Clock, ChefHat, Users, ArrowLeft, Lock, CheckCircle, Minus, Plus } from 'lucide-react';
import placeholderReceta from '../../assets/recipe/placeholder-recipe.jpg';

const DIFICULTAD_ESTILOS = {
  facil: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
  media: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
  dificil: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
};

export default function RecetaDetalle() {
  const { id } = useParams<{ id: string }>();
  const { receta, loading, error } = useReceta(id);
  const [porciones, setPorciones] = useState(1);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="h-72 rounded-2xl bg-stone-200 dark:bg-stone-800 animate-pulse mb-6" />
        <div className="h-8 w-2/3 rounded-xl bg-stone-200 dark:bg-stone-800 animate-pulse mb-4" />
        <div className="h-4 w-full rounded-xl bg-stone-200 dark:bg-stone-800 animate-pulse mb-2" />
        <div className="h-4 w-3/4 rounded-xl bg-stone-200 dark:bg-stone-800 animate-pulse" />
      </div>
    );
  }

  if (error || !receta) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-stone-500 dark:text-stone-400 text-lg mb-4">No se pudo cargar la receta.</p>
        <Link to="/" className="text-amber-600 dark:text-amber-400 hover:underline">← Volver al inicio</Link>
      </div>
    );
  }

  const pasosOrdenados = [...receta.pasos].sort((a, b) => a.orden - b.orden);

  return (
    <div className="max-w-4xl mx-auto">

      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>

      <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-6">
        <img
          src={receta.imagenUrl ?? placeholderReceta}
          alt={receta.titulo}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {receta.esPremium && (
          <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-amber-400 text-amber-950">
            <Lock className="w-3 h-3" /> Premium
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${DIFICULTAD_ESTILOS[receta.dificultad]}`}>
          {receta.dificultad.charAt(0).toUpperCase() + receta.dificultad.slice(1)}
        </span>
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
          {receta.categoriaNombre}
        </span>
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-3 leading-tight">
        {receta.titulo}
      </h1>

      <p className="text-stone-500 dark:text-stone-400 text-base mb-6 leading-relaxed">
        {receta.descripcion}
      </p>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-white border border-stone-200 dark:border-stone-700 dark:bg-stone-800 rounded-2xl p-4 text-center">
          <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-stone-800 dark:text-stone-100">{receta.tiempoEstimadoMin}</p>
          <p className="text-xs text-stone-400">minutos</p>
        </div>
        <div className="bg-white border border-stone-200 dark:border-stone-700 dark:bg-stone-800 rounded-2xl p-4 text-center">
          <Users className="w-5 h-5 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-stone-800 dark:text-stone-100">{receta.totalIngredientes}</p>
          <p className="text-xs text-stone-400">ingredientes</p>
        </div>
        <div className="bg-white border border-stone-200 dark:border-stone-700 dark:bg-stone-800 rounded-2xl p-4 text-center">
          <ChefHat className="w-5 h-5 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
          <p className="text-sm font-bold text-stone-800 dark:text-stone-100 truncate">{receta.chefNombre}</p>
          <p className="text-xs text-stone-400">chef</p>
        </div>
      </div>

      <div className="bg-white border border-stone-200 dark:border-stone-700 dark:bg-stone-800 rounded-2xl p-5 mb-8 flex items-center justify-between">
        <span className="text-sm font-medium text-stone-700 dark:text-stone-200">Porciones</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPorciones(p => Math.max(1, p - 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-xl font-bold text-stone-800 dark:text-stone-100 w-6 text-center">{porciones}</span>
          <button
            onClick={() => setPorciones(p => p + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-6">
          <h2 className="font-serif text-xl font-semibold text-stone-800 dark:text-stone-100 mb-4">Ingredientes</h2>
          <ul className="space-y-3">
            {receta.ingredientes.map((ing, i) => {
              const cantNumerica = parseFloat(ing.cantidad) || 1;
              const resultado = (cantNumerica * porciones).toFixed(1).replace('.0', '');
              return (
                <li key={i} className="flex items-center justify-between text-sm border-b border-stone-100 dark:border-stone-700 pb-2 last:border-0 last:pb-0">
                  <span className="text-stone-700 dark:text-stone-300">{ing.nombre}</span>
                  <span className="text-stone-500 dark:text-stone-400 font-medium">
                    {resultado} {ing.unidad}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-6">
          <h2 className="font-serif text-xl font-semibold text-stone-800 dark:text-stone-100 mb-4">Preparación</h2>
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

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-1">Chef</p>
          <p className="font-serif text-lg font-bold text-stone-800 dark:text-stone-100">{receta.chefNombre}</p>
          <p className="text-sm text-stone-500 dark:text-stone-400">Especialista en {receta.categoriaNombre}</p>
        </div>
        <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Verificado</span>
        </div>
      </div>

    </div>
  );
}