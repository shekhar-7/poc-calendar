import React, { useState, useEffect } from "react";
import {
  addEvent,
  updateEvent,
  deleteEvent,
  selectLoading,
  selectError,
  setGoogleEvents,
} from "./calendarSlice";
import { useSelector, useDispatch } from "react-redux";
import { useCalendlyEventListener } from "react-calendly";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { PopupModal } from "react-calendly";
import { fetchCalendlyEvents, fetchUser } from "./calendarApi";
import GoogleLoginComponent from "../googleLogin/googleLoginComponent";
// import { CALENDLY_USER_NAME } from "../../../utils/config";
const CalendarComponent = () => {
  const dispatch = useDispatch();
  const {
    events,
    calendlyUrl,
    calendlyEvents,
    calendlyUser,
    isModalOpen,
    selectedEvent,
    loading,
    error,
  } = useSelector((state) => state.calendar);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch Calendly user and events on mount
  useEffect(() => {
    const fetchData = async () => {
      const userResult = await dispatch(fetchUser());
      if (fetchUser.fulfilled.match(userResult)) {
        // If user fetch is successful, fetch events
        dispatch(fetchCalendlyEvents());
      }
    };

    fetchData();
  }, [dispatch]);

  useCalendlyEventListener({
    onEventScheduled: (event) => {
      console.log("Event Scheduled:", event);
      const { event_uri, invitee_uri } = event.data.payload;
      // alert(
      //   `Event Scheduled!\nEvent URI: ${event_uri}\nInvitee URI: ${invitee_uri}`
      // );
      dispatch(fetchCalendlyEvents());
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
    <div>
      <div className="calendar-container">
        <FullCalendar
          height="75vh"
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin,
          ]} // Add plugins
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
          }}
          editable={false} // Allow event editing
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

        <PopupModal
          url={`https://calendly.com/${
            import.meta.env.VITE_CALENDLY_USER_NAME
          }`}
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
      <div className="row">
        <div className="col">
          <GoogleLoginComponent />
        </div>
        <div className="col">
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}

          {/* Display user information */}
          {calendlyUser && (
            <div>
              <h3>Welcome, {calendlyUser.name}</h3>
              <p>Email: {calendlyUser.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;
