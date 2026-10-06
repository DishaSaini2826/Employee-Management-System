import { createContext, useContext, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(authService.getToken());

    const getJwtData = (jwtToken) => {
        if (!jwtToken) {
            return {
                role: null,
                employeeId: null
            };
        }

        try {
            const payload = JSON.parse(atob(jwtToken.split(".")[1]));

            return {
                role: payload.role || null,
                employeeId: payload.employeeId || null
            };
        } catch (error) {
            console.error("JWT data error:", error);

            return {
                role: null,
                employeeId: null
            };
        }
    };

    const login = async (email, password) => {
        const newToken = await authService.login(email, password);
        setToken(newToken);
        return newToken;
    };

    const logout = () => {
        authService.logout();
        setToken(null);
    };

    const { role, employeeId } = getJwtData(token);

    const value = {
        token,
        role,
        employeeId,

        isAuthenticated: !!token,

        isAdmin: role === "ADMIN",
        isHR: role === "HR",
        isEmployee: role === "EMPLOYEE",

        canManageEmployees:
            role === "ADMIN" || role === "HR",

        canManageUsers:
            role === "ADMIN" || role === "HR",

        canCreateHR:
            role === "ADMIN",

        canCreateEmployee:
            role === "ADMIN" || role === "HR",

        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}