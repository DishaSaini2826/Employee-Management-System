import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import Toast from "../components/Toast";
function EmployeeDetails() {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  useEffect(() => {
    const fetchEmployee = async () => {
      try { } catch (error) {
        console.error("Error fetching employee:", error);

        setToast({
          type: "error",
          message: "Failed to load employee details."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) {
    return (
      <div className="dashboard-container">

        <Navbar />

        <div className="dashboard-body">

          <Sidebar />

          <main className="dashboard-content">
            <p>Loading employee details...</p>
          </main>

        </div>

      </div>
    );
  }

  if (!employee) {
    return (
      <div className="dashboard-container">
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
        <Navbar />

        <div className="dashboard-body">

          <Sidebar />

          <main className="dashboard-content">

            <h2>Employee not found</h2>

            <Link to="/employees">
              Back to Employees
            </Link>

          </main>

        </div>

      </div>
    );
  }

  return (
    <div className="dashboard-container">


      <main className="dashboard-content">

        <div className="page-header">

          <div>
            <h1>Employee Details</h1>
            <p>View employee information</p>
          </div>

          <div>

            <Link
              to={`/employees/edit/${employee.id}`}
              className="edit-btn"
            >
              Edit Employee
            </Link>

            <Link
              to="/employees"
              className="cancel-btn"
            >
              Back
            </Link>

          </div>

        </div>

        <div className="employee-details-card">

          <div className="employee-details-header">

            <div className="employee-large-avatar">
              {employee.name
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .toUpperCase()}
            </div>

            <div>
              <h2>{employee.name}</h2>
              <p>{employee.designation}</p>
            </div>

          </div>

          <div className="details-grid">

            <div className="detail-item">
              <span>Employee ID</span>
              <strong>{employee.employeeCode}</strong>
            </div>

            <div className="detail-item">
              <span>Full Name</span>
              <strong>{employee.name}</strong>
            </div>

            <div className="detail-item">
              <span>Email</span>
              <strong>{employee.email}</strong>
            </div>

            <div className="detail-item">
              <span>Phone</span>
              <strong>{employee.phone}</strong>
            </div>

            <div className="detail-item">
              <span>Department</span>
              <strong>{employee.department}</strong>
            </div>

            <div className="detail-item">
              <span>Designation</span>
              <strong>{employee.designation}</strong>
            </div>

            <div className="detail-item">
              <span>Salary</span>
              <strong>₹{employee.salary}</strong>
            </div>

            <div className="detail-item">
              <span>Joining Date</span>
              <strong>{employee.joiningDate}</strong>
            </div>

            <div className="detail-item">
              <span>Status</span>

              <strong>
                <span
                  className={`status ${employee.status?.toLowerCase()
                    }`}
                >
                  {employee.status}
                </span>
              </strong>

            </div>

          </div>

        </div>

      </main>

    </div>

  );
}

export default EmployeeDetails;