import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Toast from "../components/Toast";
function Register() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });

  const [error, setError] = useState("");
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/register", formData);

      setToast({
        type: "success",
        message: "Registration successful!"
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration failed. Email may already exist.");
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
      <div className="auth-card register-card">

        {/* Left Side */}
        <div className="auth-info">

          <div className="brand-logo">EMS</div>

          <h1>Join EMS</h1>

          <p>
            Create your account and start managing
            your organization's workforce efficiently.
          </p>

          <div className="auth-feature">
            ✓ Easy Employee Management
          </div>

          <div className="auth-feature">
            ✓ Smart Attendance
          </div>

          <div className="auth-feature">
            ✓ Leave Tracking
          </div>

          <div className="auth-feature">
            ✓ Role Based Access
          </div>

        </div>

        {/* Right Side */}
        <div className="auth-form">

          <h2>Create Account</h2>

          <p className="form-subtitle">
            Register a new account
          </p>

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Role</label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="HR">HR</option>
                <option value="ADMIN">Admin</option>
              </select>

            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-btn">
              Register
            </button>

          </form>

          <p className="bottom-text">
            Already have an account?
            <Link to="/login"> Sign In</Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;