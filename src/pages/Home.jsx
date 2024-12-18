import CalendarComponent from "../app/features/calendar/calendarComponent";

function Home() {
  return (
    <div className="container mx-auto px-4">
      {/* <h1 className="text-3xl font-bold text-center my-8">
        Welcome to Our App
      </h1>
      <div className="text-center">
        <p className="mb-4">This is the home page of our application.</p>
      </div> */}
      <CalendarComponent />
    </div>
  );
}

export default Home;
