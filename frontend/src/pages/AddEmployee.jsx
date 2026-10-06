import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Toast from "../components/Toast";
function AddEmployee() {
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

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.employeeCode.trim()) {
      setToast({
        type: "error",
        message: "Employee ID is required."
      });
      return;
    }

    if (!formData.name.trim()) {
      setToast({
        type: "error",
        message: "Employee name is required."
      });
      return;
    }

    if (!formData.email.trim()) {
      setToast({
        type: "error",
        message: "Email is required."
      });
      return;
    }

    if (!formData.department) {
      setToast({
        type: "error",
        message: "Please select a department."
      });
      return;
    }

    if (!formData.designation.trim()) {
      setToast({
        type: "error",
        message: "Designation is required."
      });
      return;
    }

    if (!formData.salary) {
      setToast({
        type: "error",
        message: "Salary is required."
      });
      return;
    }

    if (!formData.joiningDate) {
      setToast({
        type: "error",
        message: "Joining date is required."
      });
      return;
    }

    try {
      setSaving(true);

      await api.post("/employees", {
        employeeCode: formData.employeeCode,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        designation: formData.designation,
        salary: Number(formData.salary),
        joiningDate: formData.joiningDate,
        status: formData.status,
      });

      setToast({
        type: "success",
        message: "Employee added successfully!"
      });

      navigate("/employees");
    } catch (error) {
      console.error("Error adding employee:", error);

      if (error.response) {
        console.error("Backend message:", error.response.data);

        setToast({
          type: "error",
          message:
            error.response?.data ||
            "Failed to add employee."
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
            <h1>Add Employee</h1>
            <p>Create a new employee record</p>
          </div>
        </div>

        <div className="form-container">
          <form
            onSubmit={handleSubmit}
            className="employee-form"
          >

            <div className="form-grid">

              <div className="form-group">
                <label>Employee ID</label>
                <input
                  type="text"
                  name="employeeCode"
                  placeholder="EMP001"
                  value={formData.employeeCode}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="employee@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
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
                  <option value="">
                    Select Department
                  </option>

                  <option value="IT">
                    IT
                  </option>

                  <option value="HR">
                    HR
                  </option>

                  <option value="Finance">
                    Finance
                  </option>

                  <option value="Marketing">
                    Marketing
                  </option>

                  <option value="Operations">
                    Operations
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Designation</label>

                <input
                  type="text"
                  name="designation"
                  placeholder="Software Developer"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Salary</label>

                <input
                  type="number"
                  name="salary"
                  placeholder="Enter salary"
                  min="0"
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
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
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
                {saving
                  ? "Adding..."
                  : "Add Employee"}
              </button>

            </div>

          </form>
        </div>

      </main>
    </div>
  );
}

export default AddEmployee;