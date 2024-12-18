import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; // Main FullCalendar component
import dayGridPlugin from "@fullcalendar/daygrid"; // Day/Month grid view
import timeGridPlugin from "@fullcalendar/timegrid"; // Week and Day time grid
import interactionPlugin from "@fullcalendar/interaction"; // Click/drag support
import listPlugin from "@fullcalendar/list";
import { PopupModal, useCalendlyEventListener } from "react-calendly"; // Updated import
import {
  // GoogleOAuthProvider,
  GoogleLogin,
  useGoogleLogin,
} from "@react-oauth/google";
// import GoogleCustomLogin from "./GoogleCustomLogin";
import GoogleLoginComponent from "../../app/features/googleLogin/googleLoginComponent";

const App = () => {
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [events, setEvents] = useState([
    { title: "Meeting", date: "2024-12-12" },
    { title: "Conference", date: "2024-12-15" },
  ]);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      // console.log("tokenResponse", tokenResponse);
      const { access_token } = tokenResponse;
      setIsLoading(true);
      setError(null);
      setAccessToken(access_token);
      fetchGoogleCalendarEvents(access_token).finally(() =>
        setIsLoading(false)
      );
    },
    onError: (error) => {
      setError("Failed to login with Google");
      console.error("Login Failed:", error);
    },
    scope:
      "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly",
    flow: "implicit",
    // flow: "auth-code",
  });

  const logout = () => {
    setAccessToken(null);
    setEvents([]);
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
      }));
      console.log("formattedEvents", formattedEvents);
      // Add these events to your calendar
      setEvents(formattedEvents);
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

  useCalendlyEventListener({
    onEventScheduled: (event) => {
      console.log("Event Scheduled:", event);
      const { event_uri, invitee_uri } = event.data.payload;
      // alert(
      //   `Event Scheduled!\nEvent URI: ${event_uri}\nInvitee URI: ${invitee_uri}`
      // );
    },
    onDateAndTimeSelected: (event) => {
      console.log("Date and Time Selected:", event);
      const selectedDateTime = event.data.payload.start_time;
      // alert(`Date Selected: ${selectedDateTime}`);
    },
    onEventTypeViewed: (event) => {
      console.log("Event Type Viewed:", event);
      const eventType = event.data.payload.event_type;
      // alert(`Event Type Viewed: ${eventType}`);
    },
  });

  // Function to handle date clicks
  const handleDateClick = (info) => {
    const clickedDate = new Date(info.dateStr);
    const today = new Date();

    // Set both dates to midnight (start of day)
    clickedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (clickedDate >= today) {
      console.log(`Clicked on date: ${info.dateStr}`);
      setSelectedDate(new Date(info.dateStr));
      setShowPopup(true); // Trigger the popup widget
    }
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        height="75vh"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]} // Add plugins
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
        }}
        editable={true} // Allow event editing
        weekends={true}
        selectable={true} // Allow date selection
        dateClick={handleDateClick} // Handle date clicks
        selectMirror={true}
        dayMaxEvents={true}
        //
        initialEvents={
          [
            // {
            //   id: nanoid(),
            //   title: "All-day event",
            //   start: todayStr,
            //   // date: "2020-07-29"
            // },
            // {
            //   id: nanoid(),
            //   title: "Timed event",
            //   start: todayStr + "T12:00:00",
            //   end: todayStr + "T12:30:00",
            //   // date: "2020-07-30"
            // },
          ]
        } // alternatively, use the `events` setting to fetch from a feed
        // select={handleDateSelect}
        // eventContent={renderEventContent} // custom render function
        // eventClick={handleEventClick}
        // eventsSet={() => handleEvents(events)}
        // eventDrop={handleEventDrop}
        // eventResize={handleEventResize}
        //
        eventAdd={(e) => {
          console.log("eventAdd", e);
        }}
        eventChange={(e) => {
          console.log("eventChange", e);
        }}
        eventRemove={(e) => {
          console.log("eventRemove", e);
        }}
        // renderRange={{
        //   start: new Date().toISOString().split("T")[0], // Disable dates before today
        // }}
        events={events}
        selectConstraint={{
          start: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
        }}
      />

      <div className="mt-4">
        {/* <button onClick={() => login()}>Sign in with Google</button>
        {accessToken && <button onClick={logout}>Logout</button>} */}
        {/* <GoogleCustomLogin /> */}
        <GoogleLoginComponent />
      </div>

      <PopupModal
        url="https://calendly.com/shekhar-c-aveosoft"
        // url="https://calendly.com/shrey-t-aveosoft"
        prefill={{
          date: selectedDate,
        }}
        rootElement={document.getElementById("root")}
        pageSettings={{
          // backgroundColor: "ffffff",
          hideEventTypeDetails: false,
          hideLandingPageDetails: false,
          primaryColor: "00a2ff",
          // textColor: "4d5055",
          hideGdprBanner: false,
        }}
        text="Schedule Meeting"
        styles={{
          height: "50px",
          width: "200px",
          margin: "10px auto",
        }}
        onModalClose={() => setShowPopup(false)}
        // onEventScheduled={() => setShowPopup(false)}
        // onEventCanceled={() => setShowPopup(false)}
        // onEventRescheduled={() => setShowPopup(false)}
        // onEventResized={() => setShowPopup(false)}
        // onEventMoved={() => setShowPopup(false)}
        onEventClick={(e) => {
          console.log("onEventClick", e);
          // setShowPopup(false);
        }}
        // onModalOpen={() => setShowPopup(true)}
        open={showPopup}
        // onClose={() => setShowPopup(false)} // Close the popup when done
      />
    </div>
  );
};

export default App;
