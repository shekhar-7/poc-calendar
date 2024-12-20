import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem("accessToken"));

  // Check if the user is logged in (adjust this according to your authentication logic)
  if (!userData) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" />;
  }

  // If authenticated, render the protected route
  return children;
};

export default AuthGuard;
