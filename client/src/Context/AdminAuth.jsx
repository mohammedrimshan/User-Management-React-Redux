import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

const AdminAuth = ({ children }) => {
  const admin = useSelector((state) => state.admin.admin);
  const navigate = useNavigate();

  useEffect(() => {
    // If admin exists and trying to access login page, redirect to home
    if (admin) {
      navigate('/admin/home', { replace: true });
    }
  }, [admin, navigate]);

  // Prevent showing login page if already authenticated
  if (admin) {
    return <Navigate to="/admin/home" replace />;
  }

  return children;
};

export default AdminAuth;
