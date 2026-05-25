# Mise — Frontend

Interfaz web para la plataforma de recetas de cocina Mise. Construida con React, Vite y TailwindCSS.

## Stack

- **Framework:** React 19
- **Build tool:** Vite
- **Lenguaje:** TypeScript
- **Estilos:** TailwindCSS v4
- **Animaciones:** Framer Motion
- **Routing:** React Router v7
- **Estado servidor:** TanStack Query
- **Autenticación:** Firebase SDK
- **Tiempo real:** Firebase Realtime Database
- **Deploy:** Vercel

## Producción
https://miseapp-lime.vercel.app

## Páginas

| Ruta | Descripción | Acceso |
|------|-------------|--------|
| `/` | Home — catálogo de recetas | Público |
| `/registro` | Registro de usuario | Público |
| `/login` | Inicio de sesión | Público |
| `/onboarding` | Configuración inicial de perfil | Autenticado |
| `/categorias` | Listado de categorías | Público |
| `/categoria/:id` | Recetas por categoría | Público |
| `/receta/:id` | Detalle de receta | Público |
| `/suscripcion` | Planes de suscripción | Público |
| `/perfil` | Perfil de usuario | Autenticado |
| `/premium/recetas-del-dia` | Recetas destacadas del día | Premium |
| `/premium/sugeridor` | Sugeridor de recetas con IA | Premium |
| `/premium/chat` | Seleccionar chef para chatear | Premium |
| `/premium/chat/:chefId` | Chat en tiempo real con chef | Premium |
| `/premium/mis-sesiones` | Mis sesiones agendadas | Premium |
| `/premium/agendar` | Seleccionar chef para agendar | Premium |
| `/premium/agendar/:chefId` | Agendar sesión con chef | Premium |
| `/chef/mis-recetas` | Panel de recetas del chef | Chef |
| `/chef/nueva-receta` | Crear nueva receta | Chef |
| `/chef/editar/:id` | Editar receta | Chef |
| `/chef/mis-chats` | Conversaciones con usuarios | Chef |
| `/chef/chat/:chatId` | Chat con usuario específico | Chef |
| `/chef/mis-sesiones` | Sesiones agendadas por usuarios | Chef |
| `/chef/disponibilidad` | Configurar horarios disponibles | Chef |

## Variables de entorno

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_DATABASE_URL=
VITE_BACKEND_URL=http://localhost:3000
```

## Instalación local

```bash
git clone https://github.com/hazahart/mise-frontend
cd mise-frontend
npm install
cp .env.example .env
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Funcionalidades principales

- **Autenticación** — Registro, login y onboarding multi-paso con Firebase Auth
- **Catálogo** — Exploración de recetas por categoría con selector de porciones
- **Premium** — Recetas exclusivas, sugeridor IA con Gemini, chat en tiempo real
- **Sesiones** — Agendamiento de sesiones 1:1 con chefs profesionales
- **Panel Chef** — Gestión completa de recetas y disponibilidad
- **Suscripción** — Planes mensual y anual con Stripe Checkout
- **Tema** — Soporte de modo claro y oscuro

## Autores

- **Gustavo Ramírez Mireles** — [Hazahart](https://github.com/hazahart)
- **Vanessa Fernanda Arreola Garcia** — [VanessaFAG](https://github.com/VanessaFAG)

**Materia:** Tópicos Avanzados de Desarrollo Web  
**Institución:** TECNM en Celaya
