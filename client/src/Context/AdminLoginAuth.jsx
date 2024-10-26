import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const AdminLoginAuth = ({ children }) => {
  const admin = useSelector((state) => state.admin.admin);
  const token = useSelector((state) => state.admin.token); // Check for token
  const location = useLocation();

  console.log("Admin authentication state in AdminLoginAuth:", admin);

  // If admin is not authenticated, redirect to the admin login page
  if (!admin || !token) { // Check for both admin and token
    console.log("Redirecting to /admin, as admin is not authenticated.");
    return (
      <Navigate 
        to="/" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // If admin is authenticated, allow access to the children (protected content)
  return children;
};

export default AdminLoginAuth;
