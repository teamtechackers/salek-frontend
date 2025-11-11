import { configureStore } from '@reduxjs/toolkit';
import { apiSliceWithAuth } from '../services/api/apiSlice';

export const store = configureStore({
  reducer: {
    [apiSliceWithAuth.reducerPath]: apiSliceWithAuth.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSliceWithAuth.middleware),
});