import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import posSlice from './slices/posSlice';
import productSlice from './slices/productSlice';
import customerSlice from './slices/customerSlice';
import cartSlice from './slices/cartSlice';
import offlineSlice from './slices/offlineSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    pos: posSlice,
    products: productSlice,
    customers: customerSlice,
    cart: cartSlice,
    offline: offlineSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
