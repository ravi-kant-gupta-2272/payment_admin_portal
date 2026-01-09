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
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import './styles/App.css';

function AppRoutes() {
  const navigate = useNavigate();

  function onSwitchToRegister() {
    navigate('/register');
  }

  function onSwitchToLogin() {
    navigate('/login');
  }

  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login onSwitchToRegister={onSwitchToRegister} />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register onSwitchToLogin={onSwitchToLogin} />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// Helper component to redirect root based on auth status
const RootRedirect = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}


export default App;



