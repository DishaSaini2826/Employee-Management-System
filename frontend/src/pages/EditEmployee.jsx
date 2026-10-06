import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Toast from "../components/Toast";
function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeCode: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    salary: "",
    joiningDate: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await api.get(`/employees/${id}`);

        const employee = response.data;

        setFormData({
          employeeCode: employee.employeeCode || "",
          name: employee.name || "",
          email: employee.email || "",
          phone: employee.phone || "",
          department: employee.department || "",
          designation: employee.designation || "",
          salary: employee.salary || "",
          joiningDate: employee.joiningDate || "",
          status: employee.status || "Active",
        });

      } catch (error) {
        console.error("Error fetching employee:", error);
        setToast({
          type: "error",
          message: "Failed to load employee."
        });

        setTimeout(() => {
          navigate("/employees");
        }, 1200);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await api.put(`/employees/${id}`, {
        ...formData,
        salary: Number(formData.salary),
      });

      setToast({
        type: "success",
        message: "Employee updated successfully!"
      });

      setTimeout(() => {
        navigate("/employees");
      }, 1200);

      navigate("/employees");

    } catch (error) {
      console.error("Error updating employee:", error);

      if (error.response) {
        console.error("Backend message:", error.response.data);
        console.error("Status:", error.response.status);

        setToast({
          type: "error",
          message:
            error.response?.data ||
            "Failed to update employee."
        });
      } else {
        setToast({
          type: "error",
          message: "Unable to connect to the server."
        });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
          <p>Loading employee...</p>
        </main>

      </div>
    );
  }

  return (
    <div className="dashboard-container">

      <main className="dashboard-content">

        <div className="page-header">
          <div>
            <h1>Edit Employee</h1>
            <p>Update employee information</p>
          </div>
        </div>

        <div className="form-container">

          <form onSubmit={handleSubmit} className="employee-form">

            <div className="form-grid">

              <div className="form-group">
                <label>Employee ID</label>
                <input
                  type="text"
                  name="employeeCode"
                  value={formData.employeeCode}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              <div className="form-group">
                <label>Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Joining Date</label>
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

            </div>

            <div className="form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/employees")}
              >
                Back
              </button>

              <button
                type="submit"
                className="submit-btn"
                disabled={saving}
              >
                {saving ? "Updating..." : "Update Employee"}
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>

  );
}

export default EditEmployee;