import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";
function Users() {
    const { token, isAdmin, isHR } = useAuth();

    const [users, setUsers] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "EMPLOYEE",
        employeeId: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [toast, setToast] = useState(null);
    const API_URL = "http://localhost:8080/api";

    const authConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    useEffect(() => {
        if (token) {
            fetchUsers();
            fetchEmployees();
        }
    }, [token]);

    // -----------------------------------------
    // FETCH USERS
    // -----------------------------------------

    const fetchUsers = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/users`,
                authConfig
            );

            setUsers(response.data);
            setError("");

        } catch (error) {
            console.error("Error fetching users:", error);

            setError(
                error.response?.data ||
                "Unable to load users."
            );
        }
    };

    // -----------------------------------------
    // FETCH EMPLOYEES
    // -----------------------------------------

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/employees`,
                authConfig
            );

            setEmployees(response.data);

        } catch (error) {
            console.error(
                "Error fetching employees:",
                error
            );
        }
    };

    // -----------------------------------------
    // FORM CHANGE
    // -----------------------------------------

    const handleChange = (e) => {

        const { name, value } = e.target;

        // When an existing employee is selected,
        // automatically take that employee's details
        if (name === "employeeId") {

            const selectedEmployee = employees.find(
                (employee) =>
                    Number(employee.id) === Number(value)
            );

            if (selectedEmployee) {

                setFormData((previous) => ({
                    ...previous,
                    employeeId: selectedEmployee.id,
                    name: selectedEmployee.name || "",
                    email: selectedEmployee.email || ""
                }));

            } else {

                setFormData((previous) => ({
                    ...previous,
                    employeeId: "",
                    name: "",
                    email: ""
                }));
            }

            return;
        }

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // -----------------------------------------
    // RESET FORM
    // -----------------------------------------

    const resetForm = () => {

        setFormData({
            name: "",
            email: "",
            password: "",
            role: "EMPLOYEE",
            employeeId: ""
        });

        setEditingUserId(null);
        setShowForm(false);
        setError("");
    };

    // -----------------------------------------
    // OPEN CREATE FORM
    // -----------------------------------------

    const handleAddUser = () => {

        setFormData({
            name: "",
            email: "",
            password: "",
            role: "EMPLOYEE",
            employeeId: ""
        });

        setEditingUserId(null);
        setError("");
        setSuccess("");
        setShowForm(true);
    };

    // -----------------------------------------
    // SUBMIT
    // -----------------------------------------

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        try {

            if (!formData.name.trim()) {
                setError("Name is required.");
                return;
            }

            if (!formData.email.trim()) {
                setError("Email is required.");
                return;
            }

            if (!editingUserId &&
                !formData.password.trim()) {

                setError("Password is required.");
                return;
            }

            if (
                formData.role === "EMPLOYEE" &&
                !formData.employeeId
            ) {
                setError(
                    "Please select an employee."
                );
                return;
            }

            const data = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                role: formData.role,
                employeeId:
                    formData.role === "EMPLOYEE"
                        ? Number(formData.employeeId)
                        : null
            };

            // Password only when provided
            if (formData.password.trim()) {
                data.password = formData.password;
            }

            if (editingUserId) {

                await axios.put(
                    `${API_URL}/users/${editingUserId}`,
                    data,
                    authConfig
                );

                setSuccess(
                    "User updated successfully."
                );

            } else {

                await axios.post(
                    `${API_URL}/users`,
                    {
                        ...data,
                        password: formData.password
                    },
                    authConfig
                );

                setSuccess(
                    "User created successfully."
                );
            }

            resetForm();

            await fetchUsers();

            setTimeout(() => {
                setSuccess("");
            }, 3000);

        } catch (error) {

            console.error(
                "User operation error:",
                error
            );

            const message =
                error.response?.data ||
                "Something went wrong.";

            setError(
                typeof message === "string"
                    ? message
                    : "Something went wrong."
            );
        }
    };

    // -----------------------------------------
    // EDIT USER
    // -----------------------------------------

    const handleEdit = (user) => {

        // ADMIN protected
        if (user.role === "ADMIN") {

            setToast({
                type: "error",
                message: "The ADMIN account cannot be modified."
            });

            return;
        }

        // HR cannot modify HR
        if (isHR && user.role !== "EMPLOYEE") {

            setToast({
                type: "error",
                message: "HR can modify only Employee accounts."
            });

            return;
        }

        setEditingUserId(user.id);

        setFormData({
            name: user.name || "",
            email: user.email || "",
            password: "",
            role: user.role || "EMPLOYEE",
            employeeId: user.employeeId || ""
        });

        setShowForm(true);
        setError("");
        setSuccess("");
    };

    // -----------------------------------------
    // DELETE USER
    // -----------------------------------------

    const handleDelete = async (user) => {

        if (user.role === "ADMIN") {

            setToast({
                type: "error",
                message: "The ADMIN account cannot be deleted."
            });
            return;
        }

        // HR can delete only Employee accounts
        if (isHR && user.role !== "EMPLOYEE") {

            setToast({
                type: "error",
                message: "HR can delete only Employee accounts."
            });

            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete ${user.name}?`
        );

        if (!confirmed) {
            return;
        }

        try {

            await axios.delete(
                `${API_URL}/users/${user.id}`,
                authConfig
            );

            setSuccess(
                "User deleted successfully."
            );

            await fetchUsers();

            setTimeout(() => {
                setSuccess("");
            }, 3000);

        } catch (error) {

            console.error(
                "Delete user error:",
                error
            );

            const message =
                error.response?.data ||
                "Unable to delete user.";

            setError(
                typeof message === "string"
                    ? message
                    : "Unable to delete user."
            );
        }
    };

    // -----------------------------------------
    // EMPLOYEES AVAILABLE FOR LOGIN
    // -----------------------------------------

    const availableEmployees =
        employees.filter((employee) => {

            // While editing, allow the employee
            // currently linked to this user.
            if (editingUserId) {

                const currentUser =
                    users.find(
                        (user) =>
                            user.id === editingUserId
                    );

                if (
                    currentUser &&
                    Number(currentUser.employeeId) ===
                    Number(employee.id)
                ) {
                    return true;
                }
            }

            // Do not show employees that already
            // have a login account.
            return !users.some(
                (user) =>
                    user.employeeId &&
                    Number(user.employeeId) ===
                    Number(employee.id)
            );
        });

    return (
        <div className="page-container">
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
            {/* -------------------------------- */}
            {/* PAGE HEADER */}
            {/* -------------------------------- */}

            <div className="page-header">

                <div>
                    <h1>User Management</h1>

                    <p>
                        Create and manage employee
                        login accounts
                    </p>
                </div>

                {!showForm && (
                    <button
                        className="primary-btn"
                        onClick={handleAddUser}
                    >
                        + Add User
                    </button>
                )}

            </div>

            {/* -------------------------------- */}
            {/* SUCCESS */}
            {/* -------------------------------- */}

            {success && (
                <div className="success-message">
                    {success}
                </div>
            )}

            {/* -------------------------------- */}
            {/* ERROR */}
            {/* -------------------------------- */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* -------------------------------- */}
            {/* USER FORM */}
            {/* -------------------------------- */}

            {showForm && (

                <div className="form-card user-edit-card">

                    <h2>
                        {editingUserId
                            ? "Edit User"
                            : "Create User"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        {/* NAME */}

                        <div className="form-group">

                            <label>Name</label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter name"
                                required
                            />

                        </div>

                        {/* EMAIL */}

                        <div className="form-group">

                            <label>Email</label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                required
                            />

                        </div>

                        {/* PASSWORD */}

                        {!editingUserId && (

                            <div className="form-group">

                                <label>Password</label>

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    required
                                />

                            </div>
                        )}

                        {/* ROLE */}

                        <div className="form-group">

                            <label>Role</label>

                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >

                                <option value="EMPLOYEE">
                                    Employee
                                </option>

                                {isAdmin && (
                                    <option value="HR">
                                        HR
                                    </option>
                                )}

                            </select>

                        </div>

                        {/* EMPLOYEE LINK */}

                        {formData.role === "EMPLOYEE" && (

                            <div className="form-group">

                                <label>
                                    Employee
                                </label>

                                <select
                                    name="employeeId"
                                    value={
                                        formData.employeeId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Employee
                                    </option>

                                    {availableEmployees.map(
                                        (employee) => (

                                            <option
                                                key={
                                                    employee.id
                                                }
                                                value={
                                                    employee.id
                                                }
                                            >
                                                {employee.name}
                                                {" - "}
                                                {
                                                    employee.employeeCode
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>
                        )}

                        {/* BUTTONS */}

                        <div>

                            <button
                                type="submit"
                                className="primary-btn"
                            >
                                {editingUserId
                                    ? "Update User"
                                    : "Create User"}
                            </button>

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>
            )}

            {/* -------------------------------- */}
            {/* USERS TABLE */}
            {/* -------------------------------- */}

            <div className="table-card">

                <div className="table-header">

                    <h2>
                        System Users
                    </h2>

                </div>

                <div className="table-responsive">

                    <table>

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>Name</th>

                                <th>Email</th>

                                <th>Role</th>

                                <th>Employee ID</th>

                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {users.length === 0 ? (

                                <tr>

                                    <td colSpan="6">
                                        No users found.
                                    </td>

                                </tr>

                            ) : (

                                users.map((user) => (

                                    <tr key={user.id}>

                                        <td>
                                            {user.id}
                                        </td>

                                        <td>
                                            {user.name}
                                        </td>

                                        <td>
                                            {user.email}
                                        </td>

                                        <td>
                                            {user.role}
                                        </td>

                                        <td>
                                            {user.employeeId
                                                ? user.employeeId
                                                : "-"}
                                        </td>

                                        <td>

                                            {user.role ===
                                                "ADMIN" ? (

                                                <span>
                                                    Protected
                                                </span>

                                            ) : isHR &&
                                                user.role !==
                                                "EMPLOYEE" ? (

                                                <span>
                                                    Restricted
                                                </span>

                                            ) : (

                                                <>
                                                    <button
                                                        className="edit-btn"
                                                        onClick={() =>
                                                            handleEdit(
                                                                user
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            handleDelete(
                                                                user
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}

                                        </td>

                                    </tr>
                                ))
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default Users;