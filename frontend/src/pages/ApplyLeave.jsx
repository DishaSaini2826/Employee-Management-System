import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Toast from "../components/Toast";

function ApplyLeave() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState(null);
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.leaveType) {
            setError("Please select a leave type.");
            return;
        }

        if (!formData.startDate) {
            setError("Please select a start date.");
            return;
        }

        if (!formData.endDate) {
            setError("Please select an end date.");
            return;
        }

        if (formData.endDate < formData.startDate) {
            setError("End date cannot be before start date.");
            return;
        }

        if (!formData.reason.trim()) {
            setError("Please enter a reason.");
            return;
        }

        try {
            setLoading(true);

            // Employee information is determined by the backend
            // from the logged-in user's account.
            const leaveData = {
                leaveType: formData.leaveType,
                startDate: formData.startDate,
                endDate: formData.endDate,
                reason: formData.reason.trim()
            };

            await api.post("/leaves", leaveData);

            setToast({
                type: "success",
                message: "Leave applied successfully!"
            });

            setTimeout(() => {
                navigate("/leaves");
            }, 1200);

        } catch (error) {
            console.error("Error applying leave:", error);

            setError(
                error.response?.data ||
                "Failed to apply for leave."
            );

        } finally {
            setLoading(false);
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
            {/* Page Header */}
            <div className="page-header">

                <div>
                    <h1>Apply for Leave</h1>
                    <p>Submit your leave request</p>
                </div>

                <Link
                    to="/leaves"
                    className="back-btn"
                >
                    ← Back to Leaves
                </Link>

            </div>

            {/* Error */}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* Form */}
            <div className="employee-form-card">

                <form onSubmit={handleSubmit}>

                    <div className="form-grid">

                        {/* Leave Type */}
                        <div className="input-group">

                            <label>Leave Type</label>

                            <select
                                name="leaveType"
                                value={formData.leaveType}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select Leave Type
                                </option>

                                <option value="Casual Leave">
                                    Casual Leave
                                </option>

                                <option value="Sick Leave">
                                    Sick Leave
                                </option>

                                <option value="Annual Leave">
                                    Annual Leave
                                </option>

                                <option value="Emergency Leave">
                                    Emergency Leave
                                </option>
                            </select>

                        </div>

                        {/* Start Date */}
                        <div className="input-group">

                            <label>Start Date</label>

                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        {/* End Date */}
                        <div className="input-group">

                            <label>End Date</label>

                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        {/* Reason */}
                        <div className="input-group full-width">

                            <label>Reason</label>

                            <textarea
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                placeholder="Enter reason for leave"
                                rows="5"
                                required
                            />

                        </div>

                    </div>

                    {/* Buttons */}
                    <div className="form-actions">

                        <Link
                            to="/leaves"
                            className="cancel-btn"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            className="save-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Submitting..."
                                : "Apply Leave"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default ApplyLeave;