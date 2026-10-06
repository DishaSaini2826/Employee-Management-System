import api from "./api";

const getAllEmployees = async () => {
    const response = await api.get("/employees");
    return response.data;
};

const getEmployeeById = async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
};

const addEmployee = async (employee) => {
    const response = await api.post("/employees", employee);
    return response.data;
};

const updateEmployee = async (id, employee) => {
    const response = await api.put(`/employees/${id}`, employee);
    return response.data;
};

const deleteEmployee = async (id) => {
    await api.delete(`/employees/${id}`);
};

export default {
    getAllEmployees,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee,
};