import { useEffect, useState } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true); // O token existe, então o usuário está autenticado
    } else {
      setIsAuthenticated(false); // Não há token, então o usuário não está autenticado
    }
  }, []);

  return isAuthenticated;
};

export default useAuth;
