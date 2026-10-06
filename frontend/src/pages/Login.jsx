
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);

      setToast({
        type: "success",
        message: "Login successful! Welcome back."
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);

    } catch (error) {
      console.error("Login error:", error);
      setToast({
        type: "error",
        message: "Invalid email or password."
      });
    }
  };

  return (
    <div className="auth-page">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      <div className="auth-card">

        {/* LEFT SIDE */}
        <div className="auth-info">

          <div className="brand-logo">
            EMS
          </div>

          <h1>Employee Management System</h1>

          <p>
            Manage employees, departments, attendance and leaves
            efficiently from one place.
          </p>

          <div className="auth-feature">
            ✓ Employee Management
          </div>

          <div className="auth-feature">
            ✓ Attendance Tracking
          </div>

          <div className="auth-feature">
            ✓ Leave Management
          </div>

          <div className="auth-feature">
            ✓ Secure Authentication
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="auth-form">

          <h2>Welcome Back</h2>

          <p className="form-subtitle">
            Login to your account
          </p>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* FORGOT PASSWORD */}
            <div className="form-options forgot-option">
              <Link to="/forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="login-btn"
            >
              Login
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;
