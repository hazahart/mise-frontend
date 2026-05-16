import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
//import { Login } from './pages/login/Login';
//import { Registro } from './pages/registro/Registro';
import { RutaProtegida } from './components/Ruta';

// Un componente rápido de prueba para ver el resultado de la ruta protegida y probar el logout
const Dashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      <h2>Bienvenido al Dashboard (Ruta Protegida)</h2>
      <p>Hola, {user?.nombre}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas Públicas */}
          {/* <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Rutas Privadas */}
          <Route element={<RutaProtegida />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;