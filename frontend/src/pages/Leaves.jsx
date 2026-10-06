import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";

function Leaves() {
  const {
    isAdmin,
    isHR,
    isEmployee,
    employeeId
  } = useAuth();

  const canManageLeaves = isAdmin || isHR;

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: ""
  });

  const fetchLeaves = async () => {
    try {
      setLoading(true);

      const response = await api.get("/leaves");

      setLeaves(response.data);
    } catch (error) {
      console.error("Error fetching leaves:", error);

      setToast({
        type: "error",
        message:
          error.response?.data ||
          "Failed to load leaves."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddLeave = async (e) => {
    e.preventDefault();

    if (!formData.leaveType) {
      setToast({
        type: "error",
        message: "Please select a leave type."
      });
      return;
    }

    if (!formData.startDate) {
      setToast({
        type: "error",
        message: "Please select start date."
      });
      return;
    }

    if (!formData.endDate) {
      setToast({
        type: "error",
        message: "Please select end date."
      });
      return;
    }

    if (formData.endDate < formData.startDate) {
      setToast({
        type: "error",
        message: "End date cannot be before start date."
      });
      return;
    }

    if (!formData.reason.trim()) {
      setToast({
        type: "error",
        message: "Please enter a reason."
      });
      return;
    }

    try {
      setSaving(true);

      await api.post("/leaves", {
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason
      });

      setToast({
        type: "success",
        message: "Leave applied successfully!"
      });

      setFormData({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: ""
      });

      setShowForm(false);

      fetchLeaves();

    } catch (error) {
      console.error("Error applying leave:", error);

      setToast({
        type: "error",
        message:
          error.response?.data ||
          "Failed to apply leave."
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(
        `/leaves/${id}/status`,
        { status }
      );

      setToast({
        type: "success",
        message:
          status === "Approved"
            ? "Leave approved successfully!"
            : "Leave rejected successfully!"
      });

      fetchLeaves();

    } catch (error) {
      console.error(
        "Error updating leave:",
        error
      );

      setToast({
        type: "error",
        message:
          error.response?.data ||
          "Failed to update leave."
      });
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this leave?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/leaves/${id}`);

      setToast({
        type: "success",
        message: "Leave deleted successfully!"
      });

      fetchLeaves();

    } catch (error) {
      console.error(
        "Error deleting leave:",
        error
      );

      setToast({
        type: "error",
        message:
          error.response?.data ||
          "Failed to delete leave."
      });
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

        {/* HEADER */}

        <div className="page-header">

          <div>
            <h1>
              {isEmployee
                ? "My Leaves"
                : "Leave Management"}
            </h1>

            <p>
              {isEmployee
                ? "View and manage your leave requests"
                : "Manage employee leave requests"}
            </p>
          </div>

          {isEmployee && (
            <button
              className="add-btn"
              onClick={() =>
                setShowForm(!showForm)
              }
            >
              {showForm
                ? "Cancel"
                : "+ Add Leave"}
            </button>
          )}

        </div>

        {/* ADD LEAVE FORM */}

        {isEmployee && showForm && (

          <div className="form-container">

            <form
              onSubmit={handleAddLeave}
              className="employee-form"
            >

              <div className="form-grid">

                <div className="form-group">

                  <label>Leave Type</label>

                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select Leave Type
                    </option>

                    <option value="Casual">
                      Casual Leave
                    </option>

                    <option value="Sick">
                      Sick Leave
                    </option>

                    <option value="Earned">
                      Earned Leave
                    </option>

                    <option value="Emergency">
                      Emergency Leave
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

                <div className="form-group">

                  <label>Start Date</label>

                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                  />

                </div>

                <div className="form-group">

                  <label>End Date</label>

                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                  />

                </div>

                <div className="form-group">

                  <label>Reason</label>

                  <textarea
                    name="reason"
                    placeholder="Enter reason for leave"
                    value={formData.reason}
                    onChange={handleChange}
                    rows="4"
                  />

                </div>

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Submitting..."
                    : "Submit Leave"}
                </button>

              </div>

            </form>

          </div>

        )}

        {/* LEAVE TABLE */}

        <div className="employee-table-container">

          {loading ? (

            <p className="loading-text">
              Loading leaves...
            </p>

          ) : leaves.length === 0 ? (

            <p className="empty-text">
              No leave requests found.
            </p>

          ) : (

            <table className="employee-table">

              <thead>

                <tr>

                  {!isEmployee && (
                    <th>Employee</th>
                  )}

                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>

                  {!isEmployee && (
                    <th>Action</th>
                  )}
                </tr>

              </thead>

              <tbody>

                {leaves.map((leave) => (

                  <tr key={leave.id}>

                    {!isEmployee && (
                      <td>
                        {leave.employeeName}
                      </td>
                    )}

                    <td>
                      {leave.leaveType}
                    </td>

                    <td>
                      {leave.startDate}
                    </td>

                    <td>
                      {leave.endDate}
                    </td>

                    <td>
                      {leave.reason}
                    </td>

                    <td>

                      <span
                        className={`status ${leave.status
                          ?.toLowerCase()
                          .replace(" ", "-") || ""
                          }`}
                      >
                        {leave.status}
                      </span>

                    </td>

                    {!isEmployee && (
                      <td className="action-buttons">

                        {canManageLeaves &&
                          leave.status === "Pending" && (
                            <>
                              <button
                                className="view-btn"
                                onClick={() =>
                                  handleStatusUpdate(
                                    leave.id,
                                    "Approved"
                                  )
                                }
                              >
                                Approve
                              </button>

                              <button
                                className="delete-btn"
                                onClick={() =>
                                  handleStatusUpdate(
                                    leave.id,
                                    "Rejected"
                                  )
                                }
                              >
                                Reject
                              </button>
                            </>
                          )}

                        {canManageLeaves && (
                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(leave.id)
                            }
                          >
                            Delete
                          </button>
                        )}

                      </td>
                    )}

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

export default Leaves;