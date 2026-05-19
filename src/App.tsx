import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/login/Login';
import { Registro } from './pages/login/Registro';
import { RutaProtegida } from './components/Ruta';


function Home() {
  return <div className="p-8 text-2xl font-bold">🍽️ Mise — Home</div>;
}

function NotFound() {
  return <div className="p-8 text-2xl font-bold">404 — Página no encontrada</div>;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        <Route element={<RutaProtegida />}>
          <Route path="/dashboard" element={<Home />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;