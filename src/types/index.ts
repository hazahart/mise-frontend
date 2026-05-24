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
