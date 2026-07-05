import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');

  if (!token) {
    // Token yoksa kullanıcıyı giriş sayfasına yönlendir
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;