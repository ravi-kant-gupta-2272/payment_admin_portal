import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  plans: [
    {
      id: '1',
      name: 'Basic Plan',
      subscriptions: {
        trial: { enabled: true, days: 14, amount: 0 },
        monthly: { enabled: true, amount: 29.99 },
        quarterly: { enabled: true, amount: 79.99 },
        yearly: { enabled: true, amount: 299.99 },
      },
      description: 'Perfect for small teams getting started',
      features: [
        'Up to 10 users',
        'Basic support',
        '5 GB storage',
        'Email notifications',
      ],
      isActive: true,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Pro Plan',
      subscriptions: {
        trial: { enabled: true, days: 30, amount: 0 },
        monthly: { enabled: true, amount: 79.99 },
        quarterly: { enabled: true, amount: 219.99 },
        yearly: { enabled: true, amount: 799.99 },
      },
      description: 'For growing businesses that need more',
      features: [
        'Up to 50 users',
        'Priority support',
        '50 GB storage',
        'Advanced analytics',
        'API access',
      ],
      isActive: true,
      createdAt: '2024-01-15',
    },
    {
      id: '3',
      name: 'Enterprise Plan',
      subscriptions: {
        trial: { enabled: true, days: 30, amount: 0 },
        monthly: { enabled: true, amount: 199.99 },
        quarterly: { enabled: true, amount: 549.99 },
        yearly: { enabled: true, amount: 1999.99 },
      },
      description: 'For large organizations with advanced needs',
      features: [
        'Unlimited users',
        '24/7 premium support',
        'Unlimited storage',
        'Advanced security',
        'Dedicated account manager',
      ],
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
        state.plans[index] = {
          ...state.plans[index],
          ...data,
          id: state.plans[index].id,
          createdAt: state.plans[index].createdAt,
        };
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