import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RutaProtegida = () => {
  const { isAuthenticated } = useAuth();

  // Si no está logueado, pues no puede acceder a esta ruta, lo redirigimos al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está logueado, renderiza los componentes
  return <Outlet />;
};