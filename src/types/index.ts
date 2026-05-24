export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  fotoUrl: string | null;
  rol: "free" | "premium" | "chef";
  suscripcionActiva: boolean;
  suscripcionExpira: string | null;
  stripeCustomerId: string | null;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  imagenUrl: string | null;
  totalRecetas: number;
}

export interface RecetaResumen {
  id: string;
  titulo: string;
  categoriaId: string;
  categoriaNombre: string;
  chefId: string;
  chefNombre: string;
  imagenUrl: string | null;
  tiempoEstimadoMin: number;
  dificultad: "facil" | "media" | "dificil";
  esPremium: boolean;
  totalIngredientes: number;
  creadoEn: string;
}

export interface Ingrediente {
  nombre: string;
  cantidad: string;
  unidad: string;
}

export interface Paso {
  orden: number;
  descripcion: string;
  tiempoMin?: number;
}

export interface Receta extends RecetaResumen {
  descripcion: string;
  ingredientes: Ingrediente[];
  pasos: Paso[];
  videoUrl?: string;
}