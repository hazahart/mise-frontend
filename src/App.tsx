import { Routes, Route } from 'react-router-dom';

function Home() {
  return <div className="p-8 text-2xl font-bold">🍽️ Mise — Home</div>;
}

function Login() {
  return <div className="p-8 text-2xl font-bold">🔐 Login</div>;
}

function NotFound() {
  return <div className="p-8 text-2xl font-bold">404 — Página no encontrada</div>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;