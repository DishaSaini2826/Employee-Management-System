import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function MyProfile() {

    const { employeeId } = useAuth();

    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                if (!employeeId) {
                    setError(
                        "Your account is not linked to an employee."
                    );
                    return;
                }

                const response = await api.get(
                    `/employees/${employeeId}`
                );

                setEmployee(response.data);

            } catch (error) {

                console.error(
                    "Error loading profile:",
                    error
                );

                setError(
                    error.response?.data ||
                    "Unable to load your profile."
                );

            } finally {

                setLoading(false);
            }
        };

        fetchProfile();

    }, [employeeId]);

    if (loading) {
        return (
            <div className="page-container">
                <h2>Loading profile...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <div className="error-message">
                    {error}
                </div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="page-container">
                <div className="error-message">
                    Employee profile not found.
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">

            <div className="page-header">

                {/* <div>
                    <h1>My Profile</h1>

                </div> */}

            </div>

            <div className="employee-details-card">

                <div className="details-header">

                    <div>
                        <h2>
                            {employee.name}
                        </h2>
                    </div>
                    <br />

                    <span className="status-badge">
                        {employee.status}
                    </span>

                </div>

                <div className="details-grid">

                    <div className="detail-item">
                        <label>Employee ID</label>
                        <span>
                            {employee.id}
                        </span>
                    </div>

                    <div className="detail-item">
                        <label>Employee Code</label>
                        <span>
                            {employee.employeeCode}
                        </span>
                    </div>

                    <div className="detail-item">
                        <label>Email</label>
                        <span>
                            {employee.email}
                        </span>
                    </div>

                    <div className="detail-item">
                        <label>Phone</label>
                        <span>
                            {employee.phone || "-"}
                        </span>
                    </div>

                    <div className="detail-item">
                        <label>Department</label>
                        <span>
                            {employee.department}
                        </span>
                    </div>

                    <div className="detail-item">
                        <label>Designation</label>
                        <span>
                            {employee.designation}
                        </span>
                    </div>

                    <div className="detail-item">
                        <label>Salary</label>
                        <span>
                            {employee.salary}
                        </span>
                    </div>

                    <div className="detail-item">
                        <label>Joining Date</label>
                        <span>
                            {employee.joiningDate}
                        </span>
                    </div>

                    <div className="detail-item">
                        <label>Status</label>
                        <span>
                            {employee.status}
                        </span>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default MyProfile;