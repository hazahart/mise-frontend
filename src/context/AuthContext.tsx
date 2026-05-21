//AuthContext
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  nombre: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => { //Para mantener la persistencia al regarcar la pagina
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('userSession'); 
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('userSession', JSON.stringify(userData)); // Persistencia
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userSession'); // Se limpia la persistencia
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Implementar hook useAuth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};