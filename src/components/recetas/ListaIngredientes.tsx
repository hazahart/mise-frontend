interface Ingrediente {
  nombre: string;
  cantidad: string;
  unidad: string;
}

export const ListaIngredientes = ({ ingredientes, multiplicador }: { ingredientes: Ingrediente[], multiplicador: number }) => {
  return (
    <div className="bg-[#1a1a1a] border border-neutral-800 rounded-xl p-6 mb-8 shadow-sm">
      <h3 className="text-xl font-semibold text-white mb-4 border-b border-neutral-800 pb-3">
        Ingredientes
      </h3>
      <ul className="space-y-3">
        {ingredientes.map((ing, index) => {
          // Intentamos convertir el texto a número.
          const cantNumerica = parseFloat(ing.cantidad) || 1; 
          const resultado = (cantNumerica * multiplicador).toFixed(1).replace('.0', ''); // Limpiamos el .0

          return (
            <li key={index} className="text-neutral-300 flex items-center">
              <span className="text-yellow-500 mr-3 text-lg">•</span>
              <span>
                <strong className="text-white font-medium">
                  {resultado} {ing.unidad}
                </strong>{' '}
                de {ing.nombre}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};