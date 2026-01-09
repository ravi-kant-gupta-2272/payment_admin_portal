import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tenantPlans: [
    // Example structure:
    // {
    //   id: '1',
    //   tenantId: 'tenant-1',
    //   planId: 'plan-1',
    //   startDate: '2024-01-01',
    //   status: 'active', // active, trial, expired, cancelled
    //   trialEnabled: true,
    //   trialDays: 14,
    //   trialEndDate: '2024-01-15',
    // }
  ],
  subscriptions: [
    // Example subscription data for analytics
    {
      id: 's1',
      tenantId: 'tenant-1',
      planId: 'plan-2',
      status: 'active',
      startDate: '2024-12-01',
      nextBillingDate: '2025-01-01',
      amount: 79.99,
      frequency: 'monthly',
      trialUsed: true,
      convertedFromTrial: true,
    },
  ],
  payments: [
    // Payment transaction history for analytics
    {
      id: 'pay-1',
      subscriptionId: 's1',
      tenantId: 'tenant-1',
      amount: 79.99,
      status: 'success', // success, failed, refunded, pending
      date: '2024-12-01',
      retries: 0,
    },
    {
      id: 'pay-2',
      subscriptionId: 's1',
      tenantId: 'tenant-1',
      amount: 79.99,
      status: 'failed',
      date: '2024-12-15',
      retries: 2,
    },
    {
      id: 'pay-3',
      subscriptionId: 's1',
      tenantId: 'tenant-1',
      amount: 79.99,
      status: 'success',
      date: '2024-12-16',
      retries: 0,
    },
  ],
};

const tenantPlanSlice = createSlice({
  name: 'tenantPlans',
  initialState,
  reducers: {
    assignPlanToTenant: (state, action) => {
      const { tenantId, planId, trialEnabled, trialDays } = action.payload;
      const startDate = new Date().toISOString().split('T')[0];
      let trialEndDate = null;
      let status = 'active';

      if (trialEnabled && trialDays > 0) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + trialDays);
        trialEndDate = endDate.toISOString().split('T')[0];
        status = 'trial';
      }

      const newAssignment = {
        id: Date.now().toString(),
        tenantId,
        planId,
        startDate,
        status,
        trialEnabled: trialEnabled || false,
        trialDays: trialDays || 0,
        trialEndDate,
      };

      state.tenantPlans.push(newAssignment);
    },
    updateTenantPlan: (state, action) => {
      const { id, data } = action.payload;
      const index = state.tenantPlans.findIndex((tp) => tp.id === id);
      if (index !== -1) {
        state.tenantPlans[index] = { ...state.tenantPlans[index], ...data };
      }
    },
    removeTenantPlan: (state, action) => {
      state.tenantPlans = state.tenantPlans.filter((tp) => tp.id !== action.payload);
    },
    convertTrialToActive: (state, action) => {
      const tenantPlan = state.tenantPlans.find((tp) => tp.id === action.payload);
      if (tenantPlan) {
        tenantPlan.status = 'active';
      }
    },
    addSubscription: (state, action) => {
      state.subscriptions.push({
        ...action.payload,
        id: Date.now().toString(),
      });
    },
    updateSubscription: (state, action) => {
      const { id, data } = action.payload;
      const index = state.subscriptions.findIndex((s) => s.id === id);
      if (index !== -1) {
        state.subscriptions[index] = { ...state.subscriptions[index], ...data };
      }
    },
    addPayment: (state, action) => {
      state.payments.push({
        ...action.payload,
        id: `pay-${Date.now()}`,
      });
    },
  },
});

export const {
  assignPlanToTenant,
  updateTenantPlan,
  removeTenantPlan,
  convertTrialToActive,
  addSubscription,
  updateSubscription,
  addPayment,
} = tenantPlanSlice.actions;

export default tenantPlanSlice.reducer;