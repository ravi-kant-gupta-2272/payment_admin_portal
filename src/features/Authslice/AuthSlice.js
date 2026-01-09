import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  currentUser: null,
  isAuthenticated: false,
};

// Load user from localStorage on initialization
const savedUser = localStorage.getItem('currentUser');
if (savedUser) {
  initialState.currentUser = JSON.parse(savedUser);
  initialState.isAuthenticated = true;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      localStorage.removeItem('currentUser');
    },
    registerUser: (state, action) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const newUser = {
        id: Date.now(),
        ...action.payload,
        role: 'admin'
      };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
    },
  },
});

export const { loginUser, logoutUser, registerUser } = authSlice.actions;
export default authSlice.reducer;