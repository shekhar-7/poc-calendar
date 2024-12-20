import axios from "axios";

// Create an Axios instance
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_PIXALLY_BACKEND_URL, // Base URL from .env
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Example: Attach token to request if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_PIXALLY_BACKEND_URL}/auth/refresh`,
            { token: refreshToken }
          );

          const newAccessToken = res.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError);
          localStorage.clear();
          window.location.href = "/login";
        }
      } else {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response.data; // Automatically return the data from the response
  },
  (error) => {
    // Handle errors globally
    // console.error("API error:", error);
    return Promise.reject(error);
  }
);

export default axiosClient;
