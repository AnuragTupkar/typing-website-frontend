import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from '../api/authApi';

const initialState = {
  token: localStorage.getItem('token') || null,
  user: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'auth/setCredentials':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
      };
    case 'auth/logout':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: null,
      };
    default:
      return state;
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

setupListeners(store.dispatch);