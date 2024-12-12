import React from 'react';
import APIClient from "../../../APIClient";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const AuthLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await APIClient.post('/auth/logout', {}, {
        withCredentials: true
      });

      if (result.data.success) {
        // Clear the JWT token from cookies
        Cookies.remove('jwt_token');
        alert("You have been logged out");
        navigate('/auth/login'); // Redirect to the login page
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default AuthLogout;
