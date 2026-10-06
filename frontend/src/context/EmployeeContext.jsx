import { createContext, useContext, useState } from "react";

const EmployeeContext = createContext();

export function EmployeeProvider({ children }) {
    const [employees, setEmployees] = useState([]);

    return (
        <EmployeeContext.Provider value={{ employees, setEmployees }}>
            {children}
        </EmployeeContext.Provider>
    );
}

export function useEmployees() {
    return useContext(EmployeeContext);
}