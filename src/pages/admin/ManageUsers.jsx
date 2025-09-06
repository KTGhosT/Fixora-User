import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/api";
import styles from "./admin-components.module.css";
import tableStyles from "../../layouts/admin/admin.module.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users on load
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
      
      const response = await axiosInstance.get("/users", {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      
      // Handle different response formats
      if (response.data && Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (response.data && response.data.users) {
        setUsers(response.data.users);
      } else if (response.data && response.data.data) {
        setUsers(response.data.data);
      } else {
        console.warn("Unexpected API response format:", response.data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.response?.data?.message || error.message || "Failed to fetch users");
      
      // If it's a 401/403 error, redirect to login
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or Update User
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
      
      if (editingUser) {
        await axiosInstance.put(`/users/${editingUser.id}`, formData, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` })
          }
        });
      } else {
        await axiosInstance.post("/users", formData, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` })
          }
        });
      }
      
      await fetchUsers();
      setFormData({ name: "", email: "", role: "" });
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
      setError(error.response?.data?.message || error.message || "Failed to save user");
    } finally {
      setIsLoading(false);
    }
  };

  // Edit User
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role || "" });
    setIsModalOpen(true);
  };

  // Delete User
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
      
      await axiosInstance.delete(`/users/${id}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      setError(error.response?.data?.message || error.message || "Failed to delete user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.manageUsers}>
      <div className={`d-flex justify-content-between align-items-center mb-4`}>
        <h2>Manage Users</h2>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={() => {
            setFormData({ name: "", email: "", role: "" });
            setEditingUser(null);
            setError(null);
            setIsModalOpen(true);
          }}
          disabled={isLoading}
        >
          Add New User
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          <strong>Error:</strong> {error}
          <button 
            type="button" 
            className="btn-close float-end" 
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Users Table */}
      <div className={styles.modernTableContainer}>
        {isLoading && users.length === 0 ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <p>No users found in the system.</p>
            <button 
              className="btn btn-outline-primary"
              onClick={fetchUsers}
              disabled={isLoading}
            >
              Retry
            </button>
          </div>
        ) : (
          <div className={tableStyles.tableResponsive}>
            <table className={`${tableStyles.table} ${tableStyles.tableStriped}`}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={user.id} className={tableStyles.tableRow}>
                    <td>{i + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role || "User"}</td>
                    <td>
                      <button
                        className={`${tableStyles.btn} ${tableStyles.btnSm} ${tableStyles.btnWarning}`}
                        style={{ marginRight: "0.5rem" }}
                        onClick={() => handleEdit(user)}
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button
                        className={`${tableStyles.btn} ${tableStyles.btnSm} ${tableStyles.btnDanger}`}
                        onClick={() => handleDelete(user.id)}
                        disabled={isLoading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>
              {editingUser ? "Edit User" : "Add New User"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  name="role"
                  className="form-control"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="worker">Worker</option>
                </select>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : editingUser ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;