import {
  configureStore,
  isRejected,
  Middleware,
} from '@reduxjs/toolkit';
import userReducer from './User.reducer';
import { notification } from 'antd';

const observeActions: Middleware =
  () => (next) => (action) => {
    if (isRejected(action)) {
      notification.error({
        message: action.error.message,
      });
    }

    next(action);
  };

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: function (getDefaultMiddleware) {
    return [...getDefaultMiddleware(), observeActions];
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
