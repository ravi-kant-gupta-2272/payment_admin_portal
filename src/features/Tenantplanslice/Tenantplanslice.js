import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tenantPlans: [],
};

const tenantPlanSlice = createSlice({
  name: 'tenantPlans',
  initialState,
  reducers: {
    assignPlanToTenant: (state, action) => {
      const { tenantId, subscriptions, status, startDate, id } = action.payload;
      
      // Check if tenant already has a plan
      const existingIndex = state.tenantPlans.findIndex((tp) => tp.tenantId === tenantId);
      
      if (existingIndex !== -1) {
        // Update existing plan
        state.tenantPlans[existingIndex] = {
          ...state.tenantPlans[existingIndex],
          subscriptions,
          status,
          startDate,
        };
      } else {
        // Add new plan assignment
        const newAssignment = {
          id: id || Date.now().toString(),
          tenantId,
          subscriptions,
          status,
          startDate: startDate || new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString().split('T')[0],
        };
        state.tenantPlans.push(newAssignment);
      }
    },
    
    updateTenantPlan: (state, action) => {
      const { id, data } = action.payload;
      const index = state.tenantPlans.findIndex((tp) => tp.id === id);
      if (index !== -1) {
        state.tenantPlans[index] = {
          ...state.tenantPlans[index],
          ...data,
        };
      }
    },
    
    removeTenantPlan: (state, action) => {
      const id = action.payload;
      state.tenantPlans = state.tenantPlans.filter((tp) => tp.id !== id);
    },
    
    updateTenantPlanStatus: (state, action) => {
      const { id, status } = action.payload;
      const plan = state.tenantPlans.find((tp) => tp.id === id);
      if (plan) {
        plan.status = status;
      }
    },
  },
});

export const {
  assignPlanToTenant,
  updateTenantPlan,
  removeTenantPlan,
  updateTenantPlanStatus,
} = tenantPlanSlice.actions;

export default tenantPlanSlice.reducer;