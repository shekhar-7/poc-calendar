import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { fetchCalendlyEvents, fetchUser } from "./calendarApi";

const initialState = {
  events: [
    { title: "Meeting", date: "2024-12-12" },
    { title: "Conference", date: "2024-12-15" },
  ], // local events
  googleEvents: [], // events from Google Calendar
  isModalOpen: false,
  selectedEvent: null, // to store currently selected event for editing/viewing
  calendlyUrl: null,
  calendlyEvents: [],
  calendlyUser: null,
  loading: false, // Loading state
  error: null, // Error state
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    // Local events management
    addEvent: (state, action) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action) => {
      const index = state.events.findIndex(
        (event) => event.id === action.payload.id
      );
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEvent: (state, action) => {
      state.events = state.events.filter(
        (event) => event.id !== action.payload
      );
    },

    // Google Calendar events
    setGoogleEvents: (state, action) => {
      state.googleEvents = action.payload;
      state.events = [...state.events, ...state.googleEvents];
    },
    clearGoogleEvents: (state) => {
      // console.log("clearing google events");
      state.googleEvents = [];
      // console.log("state.events", state.events);
      state.events = state.events.filter((e) => e.type !== "google-calendar");
    },

    // Modal management
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },

    // Selected event management
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    },

    // Calendly URL management
    setCalendlyUrl: (state, action) => {
      state.calendlyUrl = action.payload;
    },
    clearCalendlyUrl: (state) => {
      state.calendlyUrl = null;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchUser thunk
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.calendlyUser = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle fetchCalendlyEvents thunk
    builder
      .addCase(fetchCalendlyEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCalendlyEvents.fulfilled, (state, action) => {
        state.loading = false;
        // state.calendlyEvents = action.payload;
        state.events = [...state.events, ...action.payload];
      })
      .addCase(fetchCalendlyEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle fetchGoogleCalendarEvents thunk
    // builder
    //   .addCase(fetchGoogleCalendarEvents.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(fetchGoogleCalendarEvents.fulfilled, (state, action) => {
    //     state.loading = false;
    //     console.log("action.payload", action.payload);
    //     // const googleEvents = selectGoogleEvents(action.payload); // Get Google events from the state
    //     // state.events = [...state.events, ...googleEvents]; // Appe ̰nd Google Calendar events
    //   })
    //   .addCase(fetchGoogleCalendarEvents.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   });
  },
});

// Export actions
export const {
  addEvent,
  updateEvent,
  deleteEvent,
  setGoogleEvents,
  clearGoogleEvents,
  openModal,
  closeModal,
  setSelectedEvent,
  clearSelectedEvent,
  setCalendlyUrl,
  clearCalendlyUrl,
} = calendarSlice.actions;

// Export selectors
export const selectEvents = (state) => state.calendar.events;
export const selectGoogleEvents = (state) => state.calendar.googleEvents;
export const selectIsModalOpen = (state) => state.calendar.isModalOpen;
export const selectSelectedEvent = (state) => state.calendar.selectedEvent;
export const selectCalendlyUrl = (state) => state.calendar.calendlyUrl;
export const selectCalendlyEvents = (state) => state.calendar.calendlyEvents;
export const selectCalendlyUser = (state) => state.calendar.calendlyUser;
export const selectLoading = (state) => state.calendar.loading;
export const selectError = (state) => state.calendar.error;

// Configure persistence
const persistConfig = {
  key: "calendar",
  storage,
  whitelist: [
    "events",
    "googleEvents",
    "isModalOpen",
    "selectedEvent",
    "calendlyUrl",
    "calendlyEvent",
  ], // Specify which parts of state to persist
};

// Create persisted reducer
const persistedCalendarReducer = persistReducer(
  persistConfig,
  calendarSlice.reducer
);

// Export reducer
export default persistedCalendarReducer;
