
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {

    const [step, setStep] = useState(1);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // STEP 1 - SEND OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {

            const response = await api.post(
                "/auth/forgot-password",
                {
                    email: email.trim()
                }
            );

            setMessage(response.data);
            setStep(2);

        } catch (error) {

            console.error("Forgot password error:", error);

            setError(
                error.response?.data ||
                "Unable to send OTP."
            );

        } finally {
            setLoading(false);
        }
    };

    // STEP 2 - RESET PASSWORD
    const handleResetPassword = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            setError(
                "Password must contain at least 6 characters."
            );
            return;
        }

        setLoading(true);

        try {

            const response = await api.post(
                "/auth/reset-password",
                {
                    email: email.trim(),
                    otp: otp.trim(),
                    newPassword: newPassword
                }
            );

            setMessage(response.data);

            // Clear fields
            setOtp("");
            setNewPassword("");
            setConfirmPassword("");

            setStep(3);

        } catch (error) {

            console.error("Reset password error:", error);

            setError(
                error.response?.data ||
                "Unable to reset password."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                {/* LEFT SIDE */}
                <div className="auth-info">

                    <div className="brand-logo">
                        EMS
                    </div>

                    <h1>Employee Management System</h1>

                    <p>
                        Securely reset your account password
                        and continue using the Employee
                        Management System.
                    </p>

                    <div className="auth-feature">
                        ✓ Secure OTP Verification
                    </div>

                    <div className="auth-feature">
                        ✓ Password Encryption
                    </div>

                    <div className="auth-feature">
                        ✓ Secure Account Recovery
                    </div>

                </div>

                {/* RIGHT SIDE */}
                <div className="auth-form">

                    {/* STEP 1 */}
                    {step === 1 && (
                        <>
                            <h2>Forgot Password?</h2>

                            <br></br>

                            {error && (
                                <p className="error-message">
                                    {error}
                                </p>
                            )}

                            <form onSubmit={handleSendOtp}>

                                <div className="input-group">
                                    <label>Email</label>

                                    <input
                                        type="email"
                                        placeholder="Enter your registered email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="login-btn"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Sending OTP..."
                                        : "Send OTP"}
                                </button>

                            </form>
                            <br />
                            <br />

                            <p className="auth-link">
                                Remember your password?{" "}
                                <Link to="/login">
                                    Back to Login
                                </Link>
                            </p>
                        </>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <>
                            <h2>Verify OTP</h2>

                            <p className="form-subtitle">
                                Enter the OTP sent to your email
                            </p>

                            {message && (
                                <p className="success-message">
                                    {message}
                                </p>
                            )}

                            {error && (
                                <p className="error-message">
                                    {error}
                                </p>
                            )}

                            <form onSubmit={handleResetPassword}>

                                <div className="input-group">
                                    <label>OTP</label>

                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(e) =>
                                            setOtp(e.target.value)
                                        }
                                        maxLength="6"
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label>New Password</label>

                                    <input
                                        type="password"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Confirm Password</label>

                                    <input
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="login-btn"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Resetting Password..."
                                        : "Reset Password"}
                                </button>

                            </form>

                            <p className="auth-link">
                                <Link to="/login">
                                    Back to Login
                                </Link>
                            </p>
                        </>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                        <>
                            <h2>Password Reset Successful</h2>

                            <p className="form-subtitle">
                                Your password has been changed successfully.
                            </p>

                            {message && (
                                <p className="success-message">
                                    {message}
                                </p>
                            )}

                            <Link
                                to="/login"
                                className="login-btn reset-login-link"
                            >
                                Go to Login
                            </Link>
                        </>
                    )}

                </div>

            </div>

        </div >
    );
}

export default ForgotPassword;
