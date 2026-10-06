import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const {
    role,
    employeeId,
    isAdmin,
    isHR,
    isEmployee
  } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      try {
        const employeeResponse = await api.get("/employees");
        setEmployees(employeeResponse.data);
      } catch (error) {
        console.error("Error loading employees:", error);
        setError("Unable to load employee data.");
      }

      try {
        const departmentResponse = await api.get("/departments");
        setDepartments(departmentResponse.data);
      } catch (error) {
        console.error("Error loading departments:", error);
        setError("Unable to load department data.");
      }

      try {
        const leaveResponse = await api.get("/leaves");
        setLeaves(leaveResponse.data);
      } catch (error) {
        console.error("Error loading leaves:", error);
        setError("Unable to load leave data.");
      }

      try {
        const attendanceResponse = await api.get("/attendance");
        setAttendance(attendanceResponse.data);
      } catch (error) {
        console.error("Error loading attendance:", error);
        setError("Unable to load attendance data.");
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  /*
   * ADMIN / HR DASHBOARD
   */
  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (employee) => employee.status === "Active"
  ).length;

  const totalDepartments = departments.length;

  const pendingLeaves = leaves.filter(
    (leave) => leave.status === "Pending"
  ).length;

  /*
   * EMPLOYEE DASHBOARD
   *
   * The backend already returns only the employee's own
   * leave records, so leaves can be used directly.
   */

  const myPendingLeaves = leaves.filter(
    (leave) => leave.status === "Pending"
  ).length;

  const myApprovedLeaves = leaves.filter(
    (leave) => leave.status === "Approved"
  ).length;

  const myRejectedLeaves = leaves.filter(
    (leave) => leave.status === "Rejected"
  ).length;

  /*
   * Attendance filtering.
   *
   * Different backend versions may return employeeId
   * as employeeId or employee.id.
   */
  const myAttendance = attendance.filter((record) => {
    const recordEmployeeId =
      record.employeeId ??
      record.employee?.id;

    return (
      recordEmployeeId != null &&
      Number(recordEmployeeId) === Number(employeeId)
    );
  });

  const presentCount = myAttendance.filter(
    (record) => record.status === "Present"
  ).length;

  const absentCount = myAttendance.filter(
    (record) => record.status === "Absent"
  ).length;

  const leaveCount = myAttendance.filter(
    (record) => record.status === "Leave"
  ).length;

  /*
   * ADMIN / HR ATTENDANCE SUMMARY
   */
  const totalPresent = attendance.filter(
    (record) => record.status === "Present"
  ).length;

  const totalAbsent = attendance.filter(
    (record) => record.status === "Absent"
  ).length;

  const totalLeave = attendance.filter(
    (record) => record.status === "Leave"
  ).length;

  return (
    <div className="dashboard-container">

      {/* PAGE TITLE */}
      <div className="dashboard-title">
        <h1>Dashboard</h1>

        <p>
          {isAdmin && "Welcome Admin!"}
          {isHR && "Welcome HR!"}
          {isEmployee && "Welcome to your Employee Dashboard!"}
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="dashboard-loading">
          Loading dashboard...
        </div>
      ) : (
        <>
          {/* =========================================
              ADMIN / HR DASHBOARD
          ========================================= */}
          {(isAdmin || isHR) && (
            <>
              <div className="dashboard-cards">

                <div className="card">
                  <h3>Total Employees</h3>
                  <h2>{totalEmployees}</h2>
                </div>

                <div className="card">
                  <h3>Active Employees</h3>
                  <h2>{activeEmployees}</h2>

                </div>

                <div className="card">
                  <h3>Departments</h3>
                  <h2>{totalDepartments}</h2>

                </div>

                <div className="card">
                  <h3>Pending Leaves</h3>
                  <h2>{pendingLeaves}</h2>

                </div>

              </div>

              {/* ATTENDANCE */}
              <div className="dashboard-section">

                <div className="section-header">
                  <h2>Attendance Summary</h2>

                  <Link to="/attendance">
                    View Attendance
                  </Link>
                </div>

                <div className="attendance-summary">

                  <div className="attendance-card">
                    <h3>Present</h3>
                    <h2>{totalPresent}</h2>
                  </div>

                  <div className="attendance-card">
                    <h3>Absent</h3>
                    <h2>{totalAbsent}</h2>
                  </div>

                  <div className="attendance-card">
                    <h3>Leave</h3>
                    <h2>{totalLeave}</h2>
                  </div>

                </div>

              </div>

              {/* RECENT EMPLOYEES */}
              <div className="dashboard-section">

                <div className="section-header">
                  <h2>Recent Employees</h2>

                  <Link to="/employees">
                    View All
                  </Link>
                </div>

                <div className="recent-employees">

                  {employees
                    .slice(-5)
                    .reverse()
                    .map((employee) => (
                      <div
                        className="recent-employee"
                        key={employee.id}
                      >

                        <div className="employee-avatar">
                          {employee.name
                            ? employee.name
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .toUpperCase()
                            : "NA"}
                        </div>

                        <div className="employee-info">
                          <strong>
                            {employee.name}
                          </strong>

                          <span>
                            {employee.designation ||
                              "Employee"}
                          </span>
                        </div>

                        <span
                          className={`status ${employee.status
                            ? employee.status.toLowerCase()
                            : ""
                            }`}
                        >
                          {employee.status}
                        </span>

                      </div>
                    ))}

                  {employees.length === 0 && (
                    <p>No employees found.</p>
                  )}

                </div>

              </div>
            </>
          )}

          {/* =========================================
              EMPLOYEE DASHBOARD
          ========================================= */}
          {isEmployee && (
            <>
              {/* MY LEAVE CARDS */}
              <div className="dashboard-cards">

                <div className="card">
                  <h3>Pending Leaves</h3>
                  <h2>{myPendingLeaves}</h2>

                </div>

                <div className="card">
                  <h3>Approved Leaves</h3>
                  <h2>{myApprovedLeaves}</h2>

                </div>

                <div className="card">
                  <h3>Rejected Leaves</h3>
                  <h2>{myRejectedLeaves}</h2>

                </div>

                <div className="card">
                  <h3>Attendance Records</h3>
                  <h2>{myAttendance.length}</h2>

                </div>

              </div>

              {/* MY ATTENDANCE */}
              <div className="dashboard-section">

                <div className="section-header">
                  <h2>My Attendance</h2>

                  <Link to="/attendance">
                    View Attendance
                  </Link>
                </div>

                <div className="attendance-summary">

                  <div className="attendance-card">
                    <h3>Present</h3>
                    <h2>{presentCount}</h2>
                  </div>

                  <div className="attendance-card">
                    <h3>Absent</h3>
                    <h2>{absentCount}</h2>
                  </div>

                  <div className="attendance-card">
                    <h3>Leave</h3>
                    <h2>{leaveCount}</h2>
                  </div>

                </div>

              </div>

              {/* MY LEAVES */}
              <div className="dashboard-section">

                <div className="section-header">
                  <h2>My Leave Requests</h2>

                  <Link to="/leaves">
                    View Leaves
                  </Link>
                </div>

                <div className="recent-employees">

                  {leaves.length === 0 ? (
                    <p>No leave requests found.</p>
                  ) : (
                    leaves
                      .slice(-5)
                      .reverse()
                      .map((leave) => (
                        <div
                          className="recent-employee"
                          key={leave.id}
                        >

                          <div className="employee-info">
                            <strong>
                              {leave.leaveType}
                            </strong>

                            <span>
                              {leave.startDate} to{" "}
                              {leave.endDate}
                            </span>
                          </div>

                          <span
                            className={`status ${leave.status === "Approved"
                              ? "active"
                              : leave.status === "Rejected"
                                ? "inactive"
                                : ""
                              }`}
                          >
                            {leave.status}
                          </span>

                        </div>
                      ))
                  )}

                </div>

              </div>

              {/* APPLY LEAVE */}
              <div className="dashboard-section">

                <div className="section-header">
                  <h2>Need a Leave?</h2>

                  <Link
                    to="/leaves/apply"
                    className="add-btn"
                  >
                    + Apply Leave
                  </Link>
                </div>

              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;