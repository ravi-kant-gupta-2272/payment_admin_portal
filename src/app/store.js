import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/Authslice/AuthSlice';
import tenantReducer from '../features/Tenantslice/Tenantslice';
import planReducer from '../features/Planslice/Planslice';
import tenantPlanReducer from '../features/Tenantplanslice/Tenantplanslice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tenants: tenantReducer,
    plans: planReducer,
    tenantPlans: tenantPlanReducer,
  },
});

export default store;