import React, { useState } from 'react';

function Register({ onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.email === email)) {
      setError('Email already registered');
      return;
    }

    // Save user
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role: 'admin'
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    setSuccess('Registration successful! Please login.');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      onSwitchToLogin();
    }, 2000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#1a3a52] to-[#2c5f7d]">
      <div className="bg-white rounded-lg shadow-2xl p-12 w-full max-w-md mx-4">
        <h2 className="text-center text-[#1a3a52] mb-8 text-3xl font-semibold tracking-wide">
          Register
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block mb-2 text-gray-600 text-sm font-medium"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 py-3 border border-gray-300 rounded text-base focus:outline-none focus:border-[#2c5f7d] focus:ring-4 focus:ring-[#2c5f7d]/10 transition-all duration-300"
            />
          </div>

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

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-gray-600 text-sm font-medium"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-3 border border-gray-300 rounded text-base focus:outline-none focus:border-[#2c5f7d] focus:ring-4 focus:ring-[#2c5f7d]/10 transition-all duration-300"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm mt-2 mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-600 text-sm mt-2 mb-4">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#1a3a52] hover:bg-[#2c5f7d] text-white px-6 py-3 rounded text-base font-medium transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Register
          </button>
        </form>

        <div className="text-center mt-6 text-gray-600 text-sm">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="bg-transparent border-none text-[#2c5f7d] underline cursor-pointer text-sm hover:text-[#1a3a52] transition-colors"
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;