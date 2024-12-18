// calendarApi.js
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Calendly API Base URL
const BASE_URL = "https://api.calendly.com";

// Replace with your Calendly API Token
const API_TOKEN =
  "eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzM0MDk2NDU4LCJqdGkiOiIwMTQ0ZTg0MC04NWNkLTRhODktODA4NC0yZDIwYTAxMjI2OTUiLCJ1c2VyX3V1aWQiOiJhZmM4NTViMC01OTA5LTRlNDMtODUzNS0yMTNlMDZlZjA1NTEifQ.TsYhTKPZmUbQQ_czvIX3Idj36fOnquCwq5yggna7U0E_OnfMvB1yzvQhUOsry8FPXURFvFc_mSaVul6zGFeucA";

// Axios instance for Calendly API
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    "Content-Type": "application/json",
  },
});

/* -----------------------------------
   1. Thunks to Fetch Users and Events
   ----------------------------------- */

// Fetch User Profile
export const fetchUser = createAsyncThunk(
  "calendar/fetchUser",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get("/users/me");
      return response.data.resource; // Calendly returns user in 'resource'
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch user"
      );
    }
  }
);

// Fetch Scheduled Events
export const fetchCalendlyEvents = createAsyncThunk(
  "calendar/fetchEvents",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get("/scheduled_events", {
        params: {
          status: "active", // You can adjust filters
          user: thunkAPI.getState().calendar.calendlyUser.uri,
        },
      });
      //   return response.data.collection; // Calendly returns events in 'collection'
      // Extract events collection from response
      const calendlyEvents = response.data.collection;

      // Map Calendly events to FullCalendar format
      const fullCalendarEvents = calendlyEvents.map((event) => ({
        id: event.uri, // Use URI as unique ID
        title: event.name, // Event name
        start: event.start_time, // Start time
        end: event.end_time, // End time
        // url: event.uri, // Link to the event
        type: "calendly",
      }));

      return fullCalendarEvents;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch events"
      );
    }
  }
);
