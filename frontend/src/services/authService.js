import api from "./api";

const login = async (email, password) => {
    try {
        const response = await api.post("/auth/login", {
            email: email.trim(),
            password: password,
        });

        console.log("Login response:", response.data);

        localStorage.setItem("token", response.data);

        return response.data;
    } catch (error) {
        console.log("Backend response:", error.response?.data);
        console.log("Status:", error.response?.status);
        throw error;
    }
};

const logout = () => {
    localStorage.removeItem("token");
};

const getToken = () => {
    return localStorage.getItem("token");
};

export default {
    login,
    logout,
    getToken,
};