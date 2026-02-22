import { configureStore } from '@reduxjs/toolkit';
import authReducer from './store/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
