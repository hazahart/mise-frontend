import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase'; 

export const useReceta = (id: string | undefined) => {
  const [receta, setReceta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReceta = async () => {
      // Si no hay ID en la URL, no hace nada
      if (!id) return; 

      setLoading(true);
      setError(null);

      try {
        // Parámetros:
        const docRef = doc(db, 'recetas', id);
        
        //Realiza la consulta
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setReceta({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('La receta que buscas no existe.');
        }
      } catch (err: any) {
        console.error("Error:", err);
        setError('Hubo un problema al consultar la información.');
      } finally {
        setLoading(false);
      }
    };

    fetchReceta();
  }, [id]);

  return { receta, loading, error };
};