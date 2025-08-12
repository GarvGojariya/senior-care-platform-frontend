import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import medicationsReducer from './slices/medicationsSlice';
import schedulesReducer from './slices/schedulesSlice';
import notificationsReducer from './slices/notificationsSlice';
import usersReducer from './slices/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    medications: medicationsReducer,
    schedules: schedulesReducer,
    notifications: notificationsReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['auth.user'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
