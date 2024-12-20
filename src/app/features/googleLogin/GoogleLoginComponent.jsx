import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGoogleCredentials, logout } from "./googleLoginSlice";
import { useGoogleLogin } from "@react-oauth/google";
import { setGoogleEvents, clearGoogleEvents } from "../calendar/calendarSlice";

const GoogleLoginComponent = () => {
  const dispatch = useDispatch();
  const { accessToken, user, isAuthenticated } = useSelector(
    (state) => state.google
  );
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      // console.log("tokenResponse", tokenResponse);
      const { access_token, expires_in } = tokenResponse;
      dispatch(
        setGoogleCredentials({
          accessToken: access_token,
          email: "user@example.com",
          name: "John Doe",
          picture: "profile-picture-url",
          expires_in: expires_in,
          error: null,
          googleCalendarEvents: [],
        })
      );
      //   setIsLoading(true);
      //   setError(null);
      //   setAccessToken(access_token);
      fetchGoogleCalendarEvents(access_token);
    },
    onError: (error) => {
      setGoogleCredentials({
        accessToken: null,
        email: null,
        name: null,
        picture: null,
        expires_in: null,
        error: error,
        errorMessage: "Failed to login with Google",
        googleCalendarEvents: [],
      });
      console.error("Login Failed:", error);
    },
    scope:
      "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly",
    flow: "implicit",
  });

  const logOutFromGoogle = () => {
    // To logout
    dispatch(logout());
    dispatch(clearGoogleEvents());
  };

  const fetchGoogleCalendarEvents = async (token) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      // Transform Google Calendar events to FullCalendar format
      // console.log("data", data);
      const formattedEvents = data.items.map((event) => ({
        title: event.summary,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        type: "google-calendar",
        color: "green", // Set color for Google Calendar events
      }));
      // Add these events to your calendar
      // setEvents(formattedEvents);
      // dispatch(
      //   setGoogleCredentials({
      //     accessToken: access_token,
      //     email: "user@example.com",
      //     name: "John Doe",
      //     picture: "profile-picture-url",
      //     expires_in: expires_in,
      //     error: null,
      //     googleCalendarEvents: [],
      //   })
      // );
      dispatch(setGoogleCredentials({ googleCalendarEvents: formattedEvents }));
      dispatch(setGoogleEvents(formattedEvents));
    } catch (error) {
      console.error("Error fetching calendar events:", error);
    }
  };

  const createGoogleCalendarEvent = async (eventDetails) => {
    if (!accessToken) return;

    try {
      const event = {
        summary: eventDetails.title,
        start: {
          dateTime: eventDetails.start,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: eventDetails.end,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );

      const result = await response.json();
      console.log("Event created: ", result);
      // Refresh calendar events
      fetchGoogleCalendarEvents(accessToken);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const openCalendly = () => {
    const clientId = import.meta.env.VITE_CALENDLY_CLIENT_ID;
    const redirectUrl = import.meta.env.VITE_CALENDLY_REDIRECT_URL;
    const url = `https://calendly.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUrl}`;
    window.open(url, "_blank"); // Open the URL in a new tab
  };

  return (
    <div>
      <button onClick={() => login()}>Login with Google</button>
      {isAuthenticated && <button onClick={logOutFromGoogle}>Logout</button>}
      <button onClick={() => openCalendly()}>Calendly</button>
    </div>
  );
};

export default GoogleLoginComponent;
