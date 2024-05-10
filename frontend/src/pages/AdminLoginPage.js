import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';

const AdminLoginPage = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const basePath = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${basePath}api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: user,
          client_secret: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful', data?.access_token);
        login(data?.access_token);
        navigate('/admin/manage');
      } else {
        console.log('Login failed');
        // Perform any logic when login fails
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
      // Handle any error that occurred during the login process
    }

    // Clear form fields after submission
    setUser('');
    setPassword('');
  };

  return (
    <div id="admin-login">
      <div id="login-wrapper">
        <h4>Login to Admin</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="user">Username:</label>
            <input
              type="user"
              id="user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
            <button type="submit">Login</button>
        </form>
      </div>  
    </div>
  );
};

export default AdminLoginPage;
