interface Paso {
  descripcion: string;
  tiempoMin?: number;
  orden: number;
}

export const PasoAPaso = ({ pasos }: { pasos: Paso[] }) => {
  const pasosOrdenados = [...pasos].sort((a, b) => a.orden - b.orden);

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-white mb-4">Paso a Paso</h3>
      <div className="space-y-4">
        {pasosOrdenados.map((paso, index) => (
          <div key={index} className="flex bg-[#1a1a1a] border border-neutral-800 p-4 rounded-xl">
            <span className="text-yellow-500 font-bold text-lg mr-4">
              {paso.orden}.
            </span>
            <div className="flex-1">
              <p className="text-neutral-300 leading-relaxed">{paso.descripcion}</p>
              {paso.tiempoMin && (
                <span className="text-xs text-neutral-500 mt-2 block">
                  ⏱️ {paso.tiempoMin} min
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};