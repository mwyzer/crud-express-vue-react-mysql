// Import necessary packages and components
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import context
import { AuthContext } from "../context/AuthContext";

// Import views
import Home from "../views/home/index.jsx";
import Register from "../views/auth/register.jsx";
import Login from "../views/auth/login.jsx";

export default function AppRoutes() {
  // Destructure context to get authentication status
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Routes>
      {/* Route for Home page */}
      <Route path="/" element={<Home />} />

      {/* Route for Register page */}
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Register />
          )
        }
      />

      {/* Route for Login page */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />
    </Routes>
  );
}
