import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";
function Attendance() {
  const {
    isAdmin,
    isHR,
    isEmployee
  } = useAuth();

  const canManageAttendance =
    isAdmin || isHR;

  const [attendance, setAttendance] =
    useState([]);

  const [employees, setEmployees] =
    useState([]);

  const [settings, setSettings] =
    useState({
      checkInStart: "09:00",
      checkInEnd: "10:00",
      checkOutStart: "17:00",
      checkOutEnd: "18:00"
    });

  const [windowStatus, setWindowStatus] =
    useState(null);

  const [settingsConfigured, setSettingsConfigured] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [savingSettings, setSavingSettings] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [holidayLoading, setHolidayLoading] =
    useState(false);

  const [toast, setToast] = useState(null);
  // Display attendance time in 12-hour format with AM/PM and seconds
  const formatTime = (time) => {
    if (!time) return "-";

    const [hours, minutes, seconds = "00"] = time.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), Number(seconds), 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  };

  const [editingId, setEditingId] =
    useState(null);

  const [formData, setFormData] =
    useState({
      employeeId: "",
      date: "",
      status: "Present",
      checkInTime: "",
      checkOutTime: ""
    });

  // =========================================================
  // FETCH ATTENDANCE
  // =========================================================

  const fetchAttendance = async () => {
    try {

      const response =
        await api.get("/attendance");

      setAttendance(response.data);

    } catch (error) {

      console.error(
        "Error fetching attendance:",
        error
      );
    }
  };

  // =========================================================
  // FETCH EMPLOYEES
  // =========================================================

  const fetchEmployees = async () => {

    if (!canManageAttendance) {
      return;
    }

    try {

      const response =
        await api.get("/employees");

      setEmployees(response.data);

    } catch (error) {

      console.error(
        "Error fetching employees:",
        error
      );
    }
  };

  // =========================================================
  // FETCH ATTENDANCE WINDOW STATUS
  // =========================================================

  const fetchWindowStatus = async () => {

    try {

      const response =
        await api.get(
          "/attendance-settings/status"
        );

      setWindowStatus(response.data);

      setSettingsConfigured(
        response.data.configured
      );

    } catch (error) {

      console.error(
        "Error fetching attendance status:",
        error
      );
    }
  };

  // =========================================================
  // FETCH SETTINGS
  // ADMIN / HR
  // =========================================================

  const fetchSettings = async () => {

    if (!canManageAttendance) {
      return;
    }

    try {

      const response =
        await api.get(
          "/attendance-settings"
        );

      setSettings({
        checkInStart:
          response.data.checkInStart?.substring(0, 5) ||
          "09:00",

        checkInEnd:
          response.data.checkInEnd?.substring(0, 5) ||
          "10:00",

        checkOutStart:
          response.data.checkOutStart?.substring(0, 5) ||
          "17:00",

        checkOutEnd:
          response.data.checkOutEnd?.substring(0, 5) ||
          "18:00"
      });

      setSettingsConfigured(true);

    } catch (error) {

      console.log(
        "Attendance settings are not configured yet."
      );

      setSettingsConfigured(false);
    }
  };

  // =========================================================
  // LOAD DATA
  // =========================================================

  const loadData = async () => {

    setLoading(true);

    await fetchAttendance();
    await fetchEmployees();
    await fetchSettings();
    await fetchWindowStatus();

    setLoading(false);
  };

  useEffect(() => {

    loadData();

    const interval =
      setInterval(() => {
        fetchWindowStatus();
        fetchAttendance();
      }, 30000);

    return () => clearInterval(interval);

  }, [canManageAttendance]);

  // =========================================================
  // SETTINGS INPUT
  // =========================================================

  const handleSettingsChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setSettings((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // =========================================================
  // SAVE ATTENDANCE SETTINGS
  // =========================================================

  const handleSaveSettings = async (e) => {

    e.preventDefault();

    if (
      settings.checkInStart >=
      settings.checkInEnd
    ) {

      setToast({
        type: "error",
        message: "Check-in start time must be before end time."
      });

      return;
    }

    if (
      settings.checkOutStart >=
      settings.checkOutEnd
    ) {

      setToast({
        type: "error",
        message: "Check-out start time must be before end time."
      });

      return;
    }

    try {

      setSavingSettings(true);

      await api.put(
        "/attendance-settings",
        {
          checkInStart:
            settings.checkInStart,

          checkInEnd:
            settings.checkInEnd,

          checkOutStart:
            settings.checkOutStart,

          checkOutEnd:
            settings.checkOutEnd
        }
      );

      setToast({
        type: "success",
        message: "Attendance timings saved successfully!"
      });

      setSettingsConfigured(true);

      await fetchWindowStatus();

    } catch (error) {

      console.error(
        "Error saving attendance settings:",
        error
      );

      setToast({
        type: "error",
        message:
          error.response?.data ||
          "Failed to save attendance settings."
      });

    } finally {

      setSavingSettings(false);
    }
  };

  // =========================================================
  // HOLIDAY MANAGEMENT
  // =========================================================

  const handleMarkHoliday = async () => {
    const confirmed = window.confirm(
      "Mark today as a holiday? Employees will not be able to mark attendance today."
    );
    if (!confirmed) return;
    try {
      setHolidayLoading(true);
      const token = localStorage.getItem("token");
      console.log("TOKEN BEFORE HOLIDAY REQUEST:", token);

      await api.post("/attendance-settings/holiday");
      setToast({
        type: "success",
        message: "Today has been marked as a holiday."
      });
      await fetchWindowStatus();
      await fetchSettings();
    } catch (error) {
      console.error("Error marking holiday:", error);
      console.log("Response:", error.response);
      console.log("Status:", error.response?.status);
      console.log("Data:", error.response?.data);

      setToast({
        type: "error",
        message:
          error.response?.data ||
          "Failed to mark today as a holiday."
      });
    } finally { setHolidayLoading(false); }
  };

  const handleCancelHoliday = async () => {
    const confirmed = window.confirm(
      "Cancel today's holiday? Employees will be allowed to mark attendance according to the configured timings."
    );
    if (!confirmed) return;
    try {
      setHolidayLoading(true);
      await api.delete("/attendance-settings/holiday");
      setToast({
        type: "success",
        message: "Today's holiday has been cancelled."
      });
      await fetchWindowStatus();
      await fetchSettings();
    } catch (error) {
      console.error("Error cancelling holiday:", error);
      setToast({
        type: "error",
        message:
          error.response?.data ||
          "Failed to cancel today's holiday."
      });
    } finally { setHolidayLoading(false); }
  };

  // =========================================================
  // EMPLOYEE CHECK-IN
  // =========================================================

  const handleCheckIn = async () => {

    try {

      setActionLoading(true);

      await api.post(
        "/attendance/check-in"
      );

      setToast({
        type: "success",
        message: "Check-in successful!"
      });

      await fetchAttendance();
      await fetchWindowStatus();

    } catch (error) {

      console.error(
        "Check-in error:",
        error
      );

      setToast({
        type: "error",
        message:
          error.response?.data ||
          "Unable to check in."
      });

    } finally {

      setActionLoading(false);
    }
  };

  // =========================================================
  // EMPLOYEE CHECK-OUT
  // =========================================================

  const handleCheckOut = async () => {

    try {

      setActionLoading(true);

      await api.post(
        "/attendance/check-out"
      );

      setToast({
        type: "success",
        message: "Check-out successful!"
      });

      await fetchAttendance();
      await fetchWindowStatus();

    } catch (error) {

      console.error(
        "Check-out error:",
        error
      );

      setToast({
        type: "error",
        message:
          error.response?.data ||
          "Unable to check out."
      });

    } finally {

      setActionLoading(false);
    }
  };

  // =========================================================
  // ADMIN / HR FORM INPUT
  // =========================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // =========================================================
  // RESET ADMIN FORM
  // =========================================================

  const resetForm = () => {

    setFormData({
      employeeId: "",
      date: "",
      status: "Present",
      checkInTime: "",
      checkOutTime: ""
    });

    setEditingId(null);
  };

  // =========================================================
  // ADMIN / HR ADD OR UPDATE
  // =========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!formData.employeeId) {
      setToast({
        type: "error",
        message: "Please select an employee."
      });
      return;
    }

    if (!formData.date) {
      setToast({
        type: "error",
        message: "Please select a date."
      });
      return;
    }

    if (!formData.status) {
      setToast({
        type: "error",
        message: "Please select attendance status."
      });
      return;
    }

    try {

      setActionLoading(true);

      const selectedEmployee =
        employees.find(
          (employee) =>
            employee.id.toString() ===
            formData.employeeId.toString()
        );

      if (!selectedEmployee) {

        setToast({
          type: "error",
          message: "Employee not found."
        });
        return;
      }

      const attendanceData = {
        employeeId:
          selectedEmployee.id,

        employeeName:
          selectedEmployee.name,

        date:
          formData.date,

        status:
          formData.status,

        checkInTime:
          formData.checkInTime || null,

        checkOutTime:
          formData.checkOutTime || null
      };

      if (editingId) {

        await api.put(
          `/attendance/${editingId}`,
          attendanceData
        );

        setToast({
          type: "success",
          message: "Attendance updated successfully!"
        });

      } else {

        await api.post(
          "/attendance",
          attendanceData
        );

        setToast({
          type: "success",
          message: "Attendance marked successfully!"
        });
      }

      resetForm();

      await fetchAttendance();

    } catch (error) {

      console.error(
        "Error saving attendance:",
        error
      );

      setToast({
        type: "error",
        message:
          error.response?.data ||
          "Failed to save attendance."
      });

    } finally {

      setActionLoading(false);
    }
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (record) => {

    setEditingId(record.id);

    setFormData({
      employeeId:
        record.employeeId?.toString() || "",

      date:
        record.date || "",

      status:
        record.status || "Present",

      checkInTime:
        record.checkInTime || "",

      checkOutTime:
        record.checkOutTime || ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this attendance record?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(
        `/attendance/${id}`
      );

      setToast({
        type: "success",
        message: "Attendance record deleted successfully!"
      });

      await fetchAttendance();

    } catch (error) {

      console.error(
        "Error deleting attendance:",
        error
      );

      setToast({
        type: "error",
        message:
          error.response?.data ||
          "Failed to delete attendance record."
      });
    }
  };

  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass = (status) => {

    if (status === "Present") {
      return "status active";
    }

    if (
      status === "Absent" ||
      status === "Leave"
    ) {
      return "status inactive";
    }

    return "status";
  };

  // =========================================================
  // FIND TODAY'S EMPLOYEE RECORD
  // =========================================================

  const todayRecord =
    isEmployee &&
      windowStatus?.date
      ? attendance.find(
        (record) =>
          record.date ===
          windowStatus.date
      )
      : null;

  const hasCheckedIn =
    todayRecord?.checkInTime;

  const hasCheckedOut =
    todayRecord?.checkOutTime;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="dashboard-container">

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* HEADER */}
      <div className="page-header">

        <div>

          <h1>
            {isEmployee
              ? "My Attendance"
              : "Attendance Management"}
          </h1>

          <p>
            {isEmployee
              ? "Check in and check out using the configured attendance timings."
              : "Manage employee attendance and attendance timings."}
          </p>

        </div>

        <Link
          to="/dashboard"
          className="back-btn"
        >
          ← Dashboard
        </Link>

      </div>

      {loading ? (

        <div className="department-list-card">

          <p className="no-data">
            Loading attendance...
          </p>

        </div>

      ) : (

        <>

          {/* =================================================
              EMPLOYEE ATTENDANCE ACTIONS
          ================================================= */}

          {isEmployee && (

            <div className="department-list-card">

              <h2>
                Today's Attendance
              </h2>
              <br />
              {windowStatus?.holiday ? (
                <div className="no-data">
                  <p><strong>Today is a holiday.</strong></p>
                  <p>Attendance is not required today. Check-in and check-out are disabled.</p>
                </div>
              ) : !settingsConfigured ? (

                <p className="no-data">
                  Attendance timings have not been
                  configured by Admin/HR yet.
                </p>

              ) : (

                <>

                  <div className="form-row">

                    <div className="form-group">

                      <label>
                        Current Server Date
                      </label>

                      <input
                        type="text"
                        value={
                          windowStatus?.date || "-"
                        }
                        readOnly
                      />

                    </div>

                    <div className="form-group">

                      <label>
                        Current Server Time
                      </label>

                      <input
                        type="text"
                        value={
                          windowStatus?.currentTime
                            ?.substring(0, 8) || "-"
                        }
                        readOnly
                      />

                    </div>

                  </div>

                  <div className="form-row">

                    <div className="form-group">

                      <label>
                        Check-In Window
                      </label>

                      <input
                        type="text"
                        value={`${windowStatus?.checkInStart?.substring(0, 5)} - ${windowStatus?.checkInEnd?.substring(0, 5)}`}
                        readOnly
                      />

                    </div>

                    <div className="form-group">

                      <label>
                        Check-Out Window
                      </label>

                      <input
                        type="text"
                        value={`${windowStatus?.checkOutStart?.substring(0, 5)} - ${windowStatus?.checkOutEnd?.substring(0, 5)}`}
                        readOnly
                      />

                    </div>

                  </div>

                  <div className="form-actions">

                    {!hasCheckedIn &&
                      windowStatus?.checkInOpen && (

                        <button
                          type="button"
                          className="add-btn"
                          onClick={handleCheckIn}
                          disabled={actionLoading}
                        >
                          {actionLoading
                            ? "Processing..."
                            : "✓ Check In"}
                        </button>

                      )}

                    {hasCheckedIn &&
                      !hasCheckedOut &&
                      windowStatus?.checkOutOpen && (

                        <button
                          type="button"
                          className="add-btn"
                          onClick={handleCheckOut}
                          disabled={actionLoading}
                        >
                          {actionLoading
                            ? "Processing..."
                            : "✓ Check Out"}
                        </button>

                      )}

                  </div>

                  {hasCheckedIn && (

                    <p>
                      Check In:{" "}
                      <strong>
                        {formatTime(todayRecord.checkInTime)}
                      </strong>
                    </p>

                  )}

                  {hasCheckedOut && (

                    <p>
                      Check Out:{" "}
                      <strong>
                        {formatTime(todayRecord.checkOutTime)}
                      </strong>
                    </p>

                  )}

                  {!hasCheckedIn &&
                    !windowStatus?.checkInOpen && (

                      <p className="no-data">
                        Check-in window is currently closed.
                      </p>

                    )}

                  {hasCheckedIn &&
                    !hasCheckedOut &&
                    !windowStatus?.checkOutOpen && (

                      <p className="no-data">
                        Check-out window is currently closed.
                      </p>

                    )}

                  {hasCheckedOut && (

                    <p className="no-data">
                      You have completed today's attendance.
                    </p>

                  )}

                </>
              )}

            </div>

          )}

          {/* =================================================
              ADMIN / HR SETTINGS
          ================================================= */}

          {canManageAttendance && (

            <div className="department-list-card">

              <h2>
                Attendance Settings
              </h2>

              <p>
                Configure when employees can check in
                and check out.
              </p>

              <div className="form-actions">
                {windowStatus?.holiday ? (
                  <>
                    <p className="no-data">Today is marked as a holiday.</p>
                    <button type="button" className="cancel-btn" onClick={handleCancelHoliday} disabled={holidayLoading}>
                      {holidayLoading ? "Processing..." : "Cancel Today's Holiday"}
                    </button>
                  </>
                ) : (
                  <button type="button" className="add-btn" onClick={handleMarkHoliday} disabled={holidayLoading}>
                    {holidayLoading ? "Processing..." : "Mark Today as Holiday"}
                  </button>
                )}
              </div>

              <form
                onSubmit={handleSaveSettings}
              >

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Check-In Start
                    </label>

                    <input
                      type="time"
                      name="checkInStart"
                      value={
                        settings.checkInStart
                      }
                      onChange={
                        handleSettingsChange
                      }
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Check-In End
                    </label>

                    <input
                      type="time"
                      name="checkInEnd"
                      value={
                        settings.checkInEnd
                      }
                      onChange={
                        handleSettingsChange
                      }
                      required
                    />

                  </div>

                </div>

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Check-Out Start
                    </label>

                    <input
                      type="time"
                      name="checkOutStart"
                      value={
                        settings.checkOutStart
                      }
                      onChange={
                        handleSettingsChange
                      }
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Check-Out End
                    </label>

                    <input
                      type="time"
                      name="checkOutEnd"
                      value={
                        settings.checkOutEnd
                      }
                      onChange={
                        handleSettingsChange
                      }
                      required
                    />

                  </div>

                </div>

                <div className="form-actions">

                  <button
                    type="submit"
                    className="add-btn"
                    disabled={savingSettings}
                  >
                    {savingSettings
                      ? "Saving..."
                      : "Save Attendance Settings"}
                  </button>

                </div>

              </form>

            </div>

          )}

          {/* =================================================
              ADMIN / HR CORRECTION FORM
          ================================================= */}

          {canManageAttendance && (

            <div className="department-list-card">

              <h2>
                {editingId
                  ? "Edit Attendance"
                  : "Manual Attendance Correction"}
              </h2>

              <form
                onSubmit={handleSubmit}
              >

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Employee
                    </label>

                    <select
                      name="employeeId"
                      value={
                        formData.employeeId
                      }
                      onChange={handleChange}
                      required
                    >

                      <option value="">
                        Select Employee
                      </option>

                      {employees.map(
                        (employee) => (

                          <option
                            key={employee.id}
                            value={employee.id}
                          >
                            {employee.name}
                          </option>

                        )
                      )}

                    </select>

                  </div>

                  <div className="form-group">

                    <label>
                      Date
                    </label>

                    <input
                      type="date"
                      name="date"
                      value={
                        formData.date
                      }
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Status
                    </label>

                    <select
                      name="status"
                      value={
                        formData.status
                      }
                      onChange={handleChange}
                      required
                    >

                      <option value="Present">
                        Present
                      </option>

                      <option value="Absent">
                        Absent
                      </option>

                      <option value="Leave">
                        Leave
                      </option>

                    </select>

                  </div>

                  <div className="form-group">

                    <label>
                      Check In Time
                    </label>

                    <input
                      type="time"
                      name="checkInTime"
                      value={
                        formData.checkInTime
                      }
                      onChange={handleChange}
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Check Out Time
                    </label>

                    <input
                      type="time"
                      name="checkOutTime"
                      value={
                        formData.checkOutTime
                      }
                      onChange={handleChange}
                    />

                  </div>

                </div>

                <div className="form-actions">

                  <button
                    type="submit"
                    className="add-btn"
                    disabled={actionLoading}
                  >
                    {actionLoading
                      ? "Saving..."
                      : editingId
                        ? "Update Attendance"
                        : "Add Correction"}
                  </button>

                  {editingId && (

                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>

                  )}

                </div>

              </form>

            </div>

          )}

          {/* =================================================
              ATTENDANCE TABLE
          ================================================= */}

          <div className="department-list-card">

            <h2>
              {isEmployee
                ? "My Attendance Records"
                : "Attendance Records"}
            </h2>

            {attendance.length === 0 ? (

              <p className="no-data">
                No attendance records found.
              </p>

            ) : (

              <table>

                <thead>

                  <tr>

                    <th>ID</th>

                    <th>
                      Employee
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Check In
                    </th>

                    <th>
                      Check Out
                    </th>

                    {canManageAttendance && (
                      <th>
                        Actions
                      </th>
                    )}

                  </tr>

                </thead>

                <tbody>

                  {attendance.map(
                    (record) => (

                      <tr key={record.id}>

                        <td>
                          {record.id}
                        </td>

                        <td>
                          <strong>
                            {record.employeeName ||
                              "-"}
                          </strong>
                        </td>

                        <td>
                          {record.date || "-"}
                        </td>

                        <td>

                          <span
                            className={
                              getStatusClass(
                                record.status
                              )
                            }
                          >
                            {record.status}
                          </span>

                        </td>

                        <td>
                          {formatTime(record.checkInTime)}
                        </td>

                        <td>
                          {formatTime(record.checkOutTime)}
                        </td>

                        {canManageAttendance && (

                          <td>

                            <div className="action-buttons">

                              <button
                                className="edit-btn"
                                onClick={() =>
                                  handleEdit(
                                    record
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="delete-btn"
                                onClick={() =>
                                  handleDelete(
                                    record.id
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        )}

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            )}

          </div>

        </>

      )}

    </div>
  );
}

export default Attendance;