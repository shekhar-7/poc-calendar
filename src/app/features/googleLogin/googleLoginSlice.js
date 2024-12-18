import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialState = {
  accessToken: null,
  user: {
    email: null,
    name: null,
    picture: null,
  },
  isAuthenticated: false,
  expires_in: null,
  error: null,
  errorMessage: null,
  googleCalendarEvents: [],
};

const googleSlice = createSlice({
  name: 'google',
  initialState,
  reducers: {
    setGoogleCredentials: (state, action) => {
      const { accessToken, email, name, picture } = action.payload;
      state.accessToken = accessToken;
      state.user.email = email;
      state.user.name = name;
      state.user.picture = picture;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = {
        email: null,
        name: null,
        picture: null,
      };
      state.isAuthenticated = false;
    },
  },
});

// Configure persistence
const persistConfig = {
  key: 'google',
  storage,
  whitelist: ['accessToken', 'user', 'isAuthenticated'], // Specify which parts of state to persist
};

// Create persisted reducer
const persistedGoogleReducer = persistReducer(persistConfig, googleSlice.reducer);

export const { setGoogleCredentials, logout } = googleSlice.actions;
export default persistedGoogleReducer;