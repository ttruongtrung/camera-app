import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

// Custom hook for protected route
const useProtectedRoute = () => {
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  useEffect(() => { 
    if (!accessToken) {
      navigate('/admin');
    }
  }, [accessToken, navigate]);

  return {};
};

export default useProtectedRoute;