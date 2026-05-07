import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.1.17:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ← we'll verify this key below
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
