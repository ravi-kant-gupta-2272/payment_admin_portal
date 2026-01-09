import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  plans: [
    {
      id: '1',
      name: 'Basic Plan',
      amount: 29.99,
      frequency: 'monthly',
      description: 'Perfect for small businesses',
      features: ['Up to 10 users', 'Basic support', '5 GB storage'],
      isActive: true,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Professional Plan',
      amount: 79.99,
      frequency: 'monthly',
      description: 'For growing companies',
      features: ['Up to 50 users', 'Priority support', '50 GB storage'],
      isActive: true,
      createdAt: '2024-01-15',
    },
    {
      id: '3',
      name: 'Enterprise Plan',
      amount: 199.99,
      frequency: 'monthly',
      description: 'For large organizations',
      features: ['Unlimited users', '24/7 support', 'Unlimited storage'],
      isActive: true,
      createdAt: '2024-01-15',
    },
  ],
};

const planSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    addPlan: (state, action) => {
      const newPlan = {
        ...action.payload,
        id: Date.now().toString(),
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      state.plans.push(newPlan);
    },
    updatePlan: (state, action) => {
      const { id, data } = action.payload;
      const index = state.plans.findIndex((plan) => plan.id === id);
      if (index !== -1) {
        state.plans[index] = { ...state.plans[index], ...data };
      }
    },
    deletePlan: (state, action) => {
      state.plans = state.plans.filter((plan) => plan.id !== action.payload);
    },
    togglePlanStatus: (state, action) => {
      const plan = state.plans.find((plan) => plan.id === action.payload);
      if (plan) {
        plan.isActive = !plan.isActive;
      }
    },
  },
});

export const { addPlan, updatePlan, deletePlan, togglePlanStatus } = planSlice.actions;
export default planSlice.reducer;