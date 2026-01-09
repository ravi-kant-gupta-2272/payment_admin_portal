import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../features/Authslice/AuthSlice';

function Login({onSwitchToRegister }) {
  const dispatch = useDispatch(); // Get dispatch function
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Validate and find user
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      // Dispatch login action to Redux
      dispatch(loginUser(user));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#1a3a52] to-[#2c5f7d]">
  <div className="bg-white rounded-lg shadow-2xl p-12 w-full max-w-md mx-4">
    <h2 className="text-center text-[#1a3a52] mb-8 text-3xl font-semibold tracking-wide">
      Admin Login
    </h2>
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label 
          htmlFor="email" 
          className="block mb-2 text-gray-600 text-sm font-medium"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          className="w-full px-3 py-3 border border-gray-300 rounded text-base focus:outline-none focus:border-[#2c5f7d] focus:ring-4 focus:ring-[#2c5f7d]/10 transition-all duration-300"
        />
      </div>
      
      <div className="mb-6">
        <label 
          htmlFor="password" 
          className="block mb-2 text-gray-600 text-sm font-medium"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-3 py-3 border border-gray-300 rounded text-base focus:outline-none focus:border-[#2c5f7d] focus:ring-4 focus:ring-[#2c5f7d]/10 transition-all duration-300"
        />
      </div>
      
      {error && (
        <div className="text-red-600 text-sm mt-2 mb-4">
          {error}
        </div>
      )}
      
      <button 
        type="submit" 
        className="w-full bg-[#1a3a52] hover:bg-[#2c5f7d] text-white px-6 py-3 rounded text-base font-medium transition-all duration-300 shadow-md hover:shadow-lg"
      >
        Sign In
      </button>
    </form>
    
    <div className="text-center mt-6 text-gray-600 text-sm">
      Don't have an account?{' '}
      <button 
        onClick={onSwitchToRegister}
        className="bg-transparent border-none text-[#2c5f7d] underline cursor-pointer text-sm hover:text-[#1a3a52] transition-colors"
      >
        Register here
      </button>
    </div>
  </div>
</div>
  );
}

export default Login;