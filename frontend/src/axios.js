import axios from "axios"
import useStore from "@/store";

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
})

// Response interceptor
axiosInstance.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        await axios.post("/api/token/refresh/", null, {
          withCredentials: true, // sends refresh_token cookie
        })

        return axiosInstance(originalRequest) // retry original request
      } catch (refreshErr) {
        if (refreshErr.response?.status === 401) {
          Promise.resolve().then(() => {
            const { logout } = useStore.getState();
            logout();
          });
        }

        return Promise.reject(refreshErr)
      }
    }

    return Promise.reject(err)
  }
)

export default axiosInstance
