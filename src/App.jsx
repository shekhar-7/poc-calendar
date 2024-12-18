import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./app/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import { GOOGLE_CLIENT_ID } from "./utils/config";
import { RouterProvider } from "react-router-dom";
import CalendarComponent from "./app/features/calendar/calendarComponent";
import { router } from "./routes";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {/* Your app components */}

          {/* <div className="container">
            <CalendarComponent />
          </div> */}
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
