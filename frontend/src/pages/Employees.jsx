import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";
function Employees() {
  const { canManageEmployees } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const response = await api.get("/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setToast({
        type: "error",
        message: "Failed to load employees."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/employees/${id}`);

      setToast({
        type: "success",
        message: "Employee deleted successfully!"
      });

      fetchEmployees();

    } catch (error) {
      console.error("Error deleting employee:", error);

      if (error.response) {
        console.error(
          "Backend message:",
          error.response.data
        );

        setToast({
          type: "error",
          message:
            error.response.data ||
            "Failed to delete employee."
        });

      } else {
        setToast({
          type: "error",
          message: "Unable to connect to the server."
        });
      }
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      employee.name?.toLowerCase().includes(searchText) ||
      employee.employeeCode?.toLowerCase().includes(searchText) ||
      employee.email?.toLowerCase().includes(searchText);

    const matchesDepartment =
      department === "" || employee.department === department;

    const matchesStatus =
      status === "" || employee.status === status;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div className="dashboard-container">

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      <main className="dashboard-content">

        <div className="page-header">
          <div>
            <h1>Employees</h1>
            <p>
              {canManageEmployees
                ? "Manage all employees"
                : "View and search employees"}
            </p>
          </div>

          {canManageEmployees && (
            <Link to="/employees/add" className="add-btn">
              + Add Employee
            </Link>
          )}
        </div>

        <div>

          <input className="search-input"
            type="text"
            placeholder="Search by name, employee code or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select className="filter-select"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
          </select>

          <select className="filter-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

        </div>
        <br />
        <div className="employee-table-container">

          {loading ? (
            <p className="loading-text">
              Loading employees...
            </p>
          ) : filteredEmployees.length === 0 ? (
            <p className="empty-text">
              No employees found.
            </p>
          ) : (

            <table className="employee-table">

              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Salary</th>
                  <th>Joining Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredEmployees.map((employee) => (

                  <tr key={employee.id}>

                    <td>{employee.employeeCode}</td>

                    <td>{employee.name}</td>

                    <td>{employee.email}</td>

                    <td>{employee.phone}</td>

                    <td>{employee.department}</td>

                    <td>{employee.designation}</td>

                    <td>₹{employee.salary}</td>

                    <td>{employee.joiningDate}</td>

                    <td>
                      <span
                        className={`status ${employee.status?.toLowerCase() || ""
                          }`}
                      >
                        {employee.status}
                      </span>
                    </td>

                    <td className="action-buttons">

                      <Link
                        to={`/employees/${employee.id}`}
                        className="view-btn"
                      >
                        View
                      </Link>

                      {canManageEmployees && (
                        <>
                          <Link
                            to={`/employees/edit/${employee.id}`}
                            className="edit-btn"
                          >
                            Edit
                          </Link>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(employee.id)
                            }
                          >
                            Delete
                          </button>
                        </>
                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </main>

    </div>

  );
}

export default Employees;