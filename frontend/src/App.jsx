import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import EmployeeDetails from "./pages/EmployeeDetails";
import EditEmployee from "./pages/EditEmployee";
import Departments from "./pages/Departments";
import Leaves from "./pages/Leaves";
import Attendance from "./pages/Attendance";
import Users from "./pages/Users";
import MyProfile from "./pages/MyProfile";
import ApplyLeave from "./pages/ApplyLeave";
import AddEmployee from "./pages/AddEmployee";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import ForgotPassword from "./pages/ForgotPassword";
import "./App.css";
import Register from "./pages/Register";
function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==================== PUBLIC ==================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />


        {/* ==================== DASHBOARD ==================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>

              <Navbar />

              <div className="dashboard-body">

                <Sidebar />

                <main className="dashboard-content">
                  <Dashboard />
                </main>

              </div>

            </ProtectedRoute>
          }
        />


        {/* ==================== EMPLOYEES ==================== */}

        <Route
          path="/employees"
          element={
            <ProtectedRoute>

              <Navbar />

              <div className="dashboard-body">

                <Sidebar />

                <main className="dashboard-content">
                  <Employees />
                </main>

              </div>

            </ProtectedRoute>
          }
        />


        {/* ==================== ADD EMPLOYEE ==================== */}

        <Route
          path="/employees/add"
          element={
            <RoleRoute allowedRoles={["ADMIN", "HR"]}>
              <Navbar />
              <div className="dashboard-body">
                <Sidebar />
                <AddEmployee />
              </div>
            </RoleRoute>
          }
        />


        {/* ==================== EDIT EMPLOYEE ==================== */}

        <Route
          path="/employees/edit/:id"
          element={
            <RoleRoute allowedRoles={["ADMIN", "HR"]}>

              <Navbar />

              <div className="dashboard-body">

                <Sidebar />

                <main className="dashboard-content">
                  <EditEmployee />
                </main>

              </div>

            </RoleRoute>
          }
        />


        {/* ==================== EMPLOYEE DETAILS ==================== */}

        <Route
          path="/employees/:id"
          element={
            <ProtectedRoute>

              <Navbar />

              <div className="dashboard-body">

                <Sidebar />

                <main className="dashboard-content">
                  <EmployeeDetails />
                </main>

              </div>

            </ProtectedRoute>
          }
        />


        {/* ==================== DEPARTMENTS ==================== */}

        <Route
          path="/departments"
          element={
            <ProtectedRoute>

              <Navbar />

              <div className="dashboard-body">

                <Sidebar />

                <main className="dashboard-content">
                  <Departments />
                </main>

              </div>

            </ProtectedRoute>
          }
        />


        {/* ==================== LEAVES ==================== */}

        <Route
          path="/leaves"
          element={
            <ProtectedRoute>

              <Navbar />

              <div className="dashboard-body">

                <Sidebar />

                <main className="dashboard-content">
                  <Leaves />
                </main>

              </div>

            </ProtectedRoute>
          }
        />


        {/* ==================== ATTENDANCE ==================== */}

        <Route
          path="/attendance"
          element={
            <ProtectedRoute>

              <Navbar />

              <div className="dashboard-body">

                <Sidebar />

                <main className="dashboard-content">
                  <Attendance />
                </main>

              </div>

            </ProtectedRoute>
          }
        />


        {/* ==================== USER MANAGEMENT ==================== */}

        <Route
          path="/users"
          element={
            <RoleRoute allowedRoles={["ADMIN", "HR"]}>

              <Navbar />

              <div className="dashboard-body">

                <Sidebar />

                <main className="dashboard-content">
                  <Users />
                </main>

              </div>

            </RoleRoute>
          }
        />


        {/* ==================== MY PROFILE ==================== */}

        <Route
          path="/profile"
          element={
            <RoleRoute allowedRoles={["EMPLOYEE"]}>

              <Navbar />

              <div className="dashboard-body">

                <Sidebar />

                <main className="dashboard-content">
                  <MyProfile />
                </main>

              </div>

            </RoleRoute>
          }
        />


        {/* ==================== DEFAULT ==================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;