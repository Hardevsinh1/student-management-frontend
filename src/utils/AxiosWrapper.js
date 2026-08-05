import axios from "axios";
import { baseApiURL } from "../baseUrl";
import toast from "react-hot-toast";

const axiosWrapper = axios.create({
  baseURL: baseApiURL(),
});

axiosWrapper.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosWrapper.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Authentication failed or session expired.");
      localStorage.removeItem("userToken");
      window.location.href = "/login";
    } else if (error.response?.status === 403) {
      toast.error("Access denied. You do not have permission.");
    }
    return Promise.reject(error);
  }
);

export default axiosWrapper;
