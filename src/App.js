// import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import './styles/App.css';

// function App() {
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
//   const [currentView, setCurrentView] = useState('login');

//   // Conditionally render based on Redux state
//   if (isAuthenticated) {
//     return <Dashboard />;
//   }

//   if (currentView === 'register') {
//     return <Register onSwitchToLogin={() => setCurrentView('login')} />;
//   }

//   return <Login onSwitchToRegister={() => setCurrentView('register')} />;
// }

// export default App;

// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login or dashboard based on auth status */}
        <Route path="/" element={<RootRedirect />} />

        {/* Public Routes - redirect to dashboard if already authenticated */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />

        {/* Protected Routes - require authentication */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Add more protected routes here */}
        {/* <Route 
          path="/tenants/:id" 
          element={
            <ProtectedRoute>
              <TenantDetails />
            </ProtectedRoute>
          } 
        /> */}

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

// Helper component to redirect root based on auth status
const RootRedirect = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

export default App;



