import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tenants: [],
  loading: false,
  error: null,
};

// Load tenants from localStorage on initialization
const savedTenants = localStorage.getItem('tenants');
if (savedTenants) {
  initialState.tenants = JSON.parse(savedTenants);
}

const tenantSlice = createSlice({
  name: 'tenants',
  initialState,
  reducers: {
    setTenants: (state, action) => {
      state.tenants = action.payload;
      localStorage.setItem('tenants', JSON.stringify(action.payload));
    },
    addTenant: (state, action) => {
      const newTenant = {
        id: Date.now(),
        ...action.payload,
        enabled: true,
        createdAt: new Date().toISOString()
      };
      state.tenants.push(newTenant);
      localStorage.setItem('tenants', JSON.stringify(state.tenants));
    },
    updateTenant: (state, action) => {
      const { id, data } = action.payload;
      const index = state.tenants.findIndex(t => t.id === id);
      if (index !== -1) {
        state.tenants[index] = { ...state.tenants[index], ...data };
        localStorage.setItem('tenants', JSON.stringify(state.tenants));
      }
    },
    deleteTenant: (state, action) => {
      state.tenants = state.tenants.filter(t => t.id !== action.payload);
      localStorage.setItem('tenants', JSON.stringify(state.tenants));
    },
    toggleTenantStatus: (state, action) => {
      const tenant = state.tenants.find(t => t.id === action.payload);
      if (tenant) {
        tenant.enabled = !tenant.enabled;
        localStorage.setItem('tenants', JSON.stringify(state.tenants));
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTenants,
  addTenant,
  updateTenant,
  deleteTenant,
  toggleTenantStatus,
  setLoading,
  setError,
} = tenantSlice.actions;

export default tenantSlice.reducer;