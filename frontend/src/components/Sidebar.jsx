import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const {
    isAdmin,
    isHR,
    isEmployee,
    canManageUsers
  } = useAuth();

  const canManageEmployees = isAdmin || isHR;

  return (
    <aside className="sidebar">

      <ul>

        <li>
          <Link to="/dashboard">
            Dashboard
          </Link>
        </li>

        {canManageEmployees && (
          <li>
            <Link to="/employees">
              Employees
            </Link>
          </li>
        )}

        {isEmployee && (
          <li>
            <Link to="/profile">
              My Profile
            </Link>
          </li>
        )}

        {!isEmployee && (
          <li>
            <Link to="/departments">Departments</Link>
          </li>
        )}

        <li>
          <Link to="/leaves">
            Apply Leaves
          </Link>
        </li>

        <li>
          <Link to="/attendance">
            {isEmployee
              ? "My Attendance"
              : "Attendance"}
          </Link>
        </li>

        {canManageUsers && (
          <li>
            <Link to="/users">
              User Management
            </Link>
          </li>
        )}

      </ul>

    </aside>
  );
}

export default Sidebar;