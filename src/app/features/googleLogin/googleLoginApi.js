export const fetchGoogleCalendarEvents = async (token) => {
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
      type: 'google-calendar'
    }));
    console.log("formattedEvents", formattedEvents);
    // Add these events to your calendar
    // setEvents(formattedEvents);
    return formattedEvents;
  } catch (error) {
    console.error("Error fetching calendar events:", error);
  }
};
