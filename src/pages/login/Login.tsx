import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aquí iría lo del backend
    // Simula un login correcto con cualquier cosa, solo con que llene los campos 
    login({ nombre: 'Usuario Prueba', email });
    
    navigate('/dashboard'); 
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button type="submit">Entrar</button>

        <div>
          <p>¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p>
        </div>
      </form>
    </div>
  );
};