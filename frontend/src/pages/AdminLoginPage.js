import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { CgLogIn } from "react-icons/cg";
import { MdAdminPanelSettings } from "react-icons/md";

const AdminLoginPage = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const apiPath = process.env.REACT_APP_BE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiPath}/api/login`, {
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
        navigate('/admin/cameras');
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
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg border border-gray-300">
        <h4 className="flex items-center gap-6 text-lg font-[700] mb-5">
          <MdAdminPanelSettings size={64}/>
           Login as Administrator
          </h4>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 mt-4">
          <div className="flex items-center justify-between">
            <label htmlFor="user" className="font-semibold mb-1">Tài khoản:</label>
            <input
              type="user"
              id="user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-2/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="font-semibold mb-1">Mật khẩu:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-2/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
            <button 
              type="submit"
              className="flex items-center gap-4 mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              <CgLogIn />
              Đăng nhập</button>
        </form>
      </div>  
    </div>
  );
};

export default AdminLoginPage;
