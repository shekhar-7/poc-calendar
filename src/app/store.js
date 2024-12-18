import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import persistedGoogleReducer from "./features/googleLogin/googleLoginSlice";
import persistedCalendarReducer from "./features/calendar/calendarSlice";

export const store = configureStore({
  reducer: {
    google: persistedGoogleReducer,
    calendar: persistedCalendarReducer,
    // ... other reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
