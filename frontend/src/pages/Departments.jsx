import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Toast from "../components/Toast";

function Departments() {
  const { isAdmin, isHR, isEmployee } = useAuth();

  const canManageDepartments = isAdmin || isHR;

  const [departments, setDepartments] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // =========================
  // FETCH DEPARTMENTS
  // =========================
  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error(
        "Error fetching departments:",
        error
      );
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // =========================
  // ADD / UPDATE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setToast({
        type: "error",
        message: "Please enter department name."
      });
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        await api.put(
          `/departments/${editingId}`,
          {
            name: name.trim(),
            description: description.trim(),
          }
        );

        setToast({
          type: "success",
          message: "Department updated successfully!"
        });
      } else {
        await api.post(
          "/departments",
          {
            name: name.trim(),
            description: description.trim(),
          }
        );

        setToast({
          type: "success",
          message: "Department added successfully!"
        });
      }

      setName("");
      setDescription("");
      setEditingId(null);

      await fetchDepartments();

    } catch (error) {
      console.error(
        "Error saving department:",
        error
      );

      const message =
        error.response?.data ||
        (editingId
          ? "Failed to update department."
          : "Failed to add department.");

      setToast({
        type: "error",
        message: message
      });

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (department) => {

    if (!canManageDepartments) {
      return;
    }

    setEditingId(department.id);
    setName(department.name || "");
    setDescription(
      department.description || ""
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setDescription("");
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {

    if (!canManageDepartments) {
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this department?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(
        `/departments/${id}`
      );

      setToast({
        type: "success",
        message: "Department deleted successfully!"
      });

      await fetchDepartments();

    } catch (error) {

      console.error(
        "Error deleting department:",
        error
      );

      const message =
        error.response?.data ||
        "Failed to delete department.";

      setToast({
        type: "error",
        message: message
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

        {/* =========================
            PAGE HEADER
        ========================= */}
        <div className="page-header">

          <div>
            <h1>Departments</h1>

            <p>
              {canManageDepartments
                ? "Manage company departments"
                : "View company departments"}
            </p>
          </div>

          <Link
            to="/dashboard"
            className="back-btn"
          >
            ← Dashboard
          </Link>

        </div>

        {/* =========================
            ADMIN / HR FORM
        ========================= */}
        {canManageDepartments && (
          <div className="department-form-card">

            <h2>
              {editingId
                ? "Edit Department"
                : "Add Department"}
            </h2>
            <br />

            <form onSubmit={handleSubmit}>

              <div className="form-group">

                <label>
                  Department Name
                </label>

                <input
                  type="text"
                  placeholder="Enter department name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />

              </div>
              <br />
              <div className="form-group">

                <label>
                  Description
                </label>

                <input
                  type="text"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="form-actions">

                <button
                  type="submit"
                  className="save-btn"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : editingId
                      ? "Update Department"
                      : "Add Department"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={
                      handleCancelEdit
                    }
                  >
                    Cancel
                  </button>
                )}

              </div>

            </form>

          </div>
        )}

        {/* =========================
            DEPARTMENT LIST
        ========================= */}
        <div className="department-list-card">

          <h2>
            Department List
          </h2>
          <br />

          {departments.length > 0 ? (

            <table>

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Department Name</th>
                  <th>Description</th>

                  {canManageDepartments && (
                    <th>Actions</th>
                  )}
                </tr>

              </thead>

              <tbody>

                {departments.map(
                  (department) => (

                    <tr
                      key={department.id}
                    >

                      <td>
                        {department.id}
                      </td>

                      <td>
                        <strong>
                          {department.name}
                        </strong>
                      </td>

                      <td>
                        {department.description ||
                          "-"}
                      </td>

                      {canManageDepartments && (
                        <td>

                          <div className="action-buttons">

                            <button
                              className="edit-btn"
                              onClick={() =>
                                handleEdit(
                                  department
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="delete-btn"
                              onClick={() =>
                                handleDelete(
                                  department.id
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

          ) : (

            <p className="no-data">
              No departments found.
            </p>

          )}

        </div>

      </main>

    </div>
  );
}

export default Departments;