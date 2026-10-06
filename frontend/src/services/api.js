import axios from "axios";

const api = axios.create({
    baseURL: "https://employee-management-system-production-6d2c.up.railway.app/api",
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;