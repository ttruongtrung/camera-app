import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => {
    const token = localStorage.getItem('accessToken');
    return token ? token : null;
  });

  const login = (token) => {
    setAccessToken(token);
    localStorage.setItem('accessToken', token);
  };

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem('accessToken');
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('accessToken');
      setAccessToken(token ? token : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
