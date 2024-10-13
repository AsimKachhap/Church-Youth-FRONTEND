import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.mode === "development"
      ? "http://localhost:5173"
      : import.meta.env.VITE_BACKEND_URI,
});

export default axiosInstance;
