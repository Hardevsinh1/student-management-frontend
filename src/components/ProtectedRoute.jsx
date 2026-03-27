import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("userToken");

  if (!token) {
    toast.error("You must be logged in to view this page.");
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    
    // Check if the user's role is in the allowedRoles array
    if (allowedRoles && !allowedRoles.includes(decodedToken.role)) {
      toast.error("Access denied. Please log in again.");
      localStorage.clear();
      return <Navigate to="/login" replace />; // or to a specific unauthorized page
    }

    // Optionally check if token is expired
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("userToken");
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("userToken");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
