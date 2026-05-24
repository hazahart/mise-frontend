import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useReceta } from '../../hooks/useReceta';
import { ListaIngredientes } from '../../components/recetas/ListaIngredientes';
import { PasoAPaso } from '../../components/recetas/PasoAPaso';

// Función auxiliar para extraer el ID del video de cualquier link de YouTube
const extraerIdYoutube = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const RecetaDetalle = () => {
  const { id } = useParams<{ id: string }>(); 
  const { receta, loading, error } = useReceta(id);
  
  const [multiplicador, setMultiplicador] = useState(1); 

  if (loading) return <div className="p-8 text-white text-center">Cargando receta...</div>;
  if (error || !receta) return <div className="p-8 text-red-500 text-center">No se pudo cargar la receta.</div>;

  const imagenMostrar = receta.imagenUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800'; // Imagen de respaldo si no hay URL en la base
  
  const videoId = extraerIdYoutube(receta.videoUrl);

  return (
    <div className="max-w-4xl mx-auto p-6 text-neutral-200 bg-[#121212] min-h-screen">
      
      {/* Título y Descripción */}
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
        {receta.titulo}
      </h1>
      <p className="text-neutral-400 mb-6 italic">{receta.descripcion}</p>
      
      {/* Metadatos (Tiempo y Dificultad) */}
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

      {/* Imagen Dinámica */}
      <img 
        src={imagenMostrar} 
        alt={receta.titulo} 
        className="w-full h-64 md:h-80 object-cover rounded-2xl mb-8 border border-neutral-800"
      />

      {/* Controles de Porciones */}
      <div className="flex items-center justify-between bg-[#1a1a1a] border border-neutral-800 p-5 rounded-xl mb-8">
        <span className="text-white font-medium">Cantidad de porciones:</span>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMultiplicador(p => Math.max(1, p - 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
          >
            -
          </button>
          <span className="text-xl font-bold w-6 text-center text-white">x{multiplicador}</span>
          <button 
            onClick={() => setMultiplicador(p => p + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Lista de Ingredientes */}
      <ListaIngredientes 
        ingredientes={receta.ingredientes} 
        multiplicador={multiplicador} 
      />
      
      {/* Instrucciones Paso a Paso */}
      <PasoAPaso pasos={receta.pasos} />

      {/* Video Condicional */}
      {videoId && (
        <div className="mt-12 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 border-b border-neutral-800 pb-3">Video de la receta</h3>
          <div className="aspect-w-16 aspect-h-9 w-full rounded-2xl overflow-hidden border border-neutral-800">
            <iframe 
              className="w-full h-[400px]"
              src={`https://www.youtube.com/embed/${videoId}`} 
              title="Video de receta" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

    </div>
  );
};