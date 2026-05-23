import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useReceta } from '../../hooks/useReceta';
import { ListaIngredientes } from '../../components/recetas/ListaIngredientes';
import { PasoAPaso } from '../../components/recetas/PasoAPaso';

export const RecetaDetalle = () => {
  const { id } = useParams<{ id: string }>(); 
  const { receta, loading, error } = useReceta(id);
  
  // Como no hay "porciones" base, usaremos un multiplicador directo (1x, 2x, 3x)
  const [multiplicador, setMultiplicador] = useState(1); 

  if (loading) return <div className="p-8 text-white text-center">Cargando receta...</div>;
  if (error || !receta) return <div className="p-8 text-red-500 text-center">No se pudo cargar la receta.</div>;

  // Imagen por defecto si imagenUrl es null
  const imagenMostrar = receta.imagenUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="max-w-4xl mx-auto p-6 text-neutral-200 bg-[#121212] min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
        {receta.titulo}
      </h1>
      <p className="text-neutral-400 mb-6 italic">{receta.descripcion}</p>
      
      <div className="flex items-center gap-6 mb-6 text-sm text-neutral-400">
        <span className="flex items-center gap-2">
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" fillRule="evenodd"></path></svg>
          {receta.tiempoEstimadoMin} min
        </span>
        <span className="flex items-center gap-2 capitalize">
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          Dificultad: {receta.dificultad}
        </span>
      </div>

      <img 
        src={imagenMostrar} 
        alt={receta.titulo} 
        className="w-full h-64 md:h-80 object-cover rounded-2xl mb-8 border border-neutral-800"
      />

      <div className="flex items-center justify-between bg-[#1a1a1a] border border-neutral-800 p-5 rounded-xl mb-8">
        <span className="text-white font-medium">Multiplicar porciones:</span>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMultiplicador(p => Math.max(1, p - 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
          >
            -
          </button>
          <span className="text-xl font-bold w-6 text-center text-white">{multiplicador}x</span>
          <button 
            onClick={() => setMultiplicador(p => p + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <ListaIngredientes 
        ingredientes={receta.ingredientes} 
        multiplicador={multiplicador} 
      />
      
      <PasoAPaso pasos={receta.pasos} />

    </div>
  );
};