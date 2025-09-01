import React, { useEffect, useState } from "react";
import AdminTable from "../../components/admin/AdminTable";
import axios from "axios";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // user being edited
  const [formData, setFormData] = useState({ name: "", email: "" });

  // Fetch users on load
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://127.0.0.1:8000/api/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  };

  // Handle edit button click
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email });
  };

  // Handle update submit
  const handleUpdate = () => {
    if (!editingUser) return;

    axios
      .put(`http://127.0.0.1:8000/api/users/${editingUser.id}`, formData)
      .then(() => {
        fetchUsers(); // refresh list
        setEditingUser(null); // close modal
      })
      .catch((error) => console.error("Error updating user:", error));
  };

  // Handle delete user
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    axios
      .delete(`http://127.0.0.1:8000/api/users/${id}`)
      .then((res) => {
        alert(res.data.message); // optional confirmation
        setUsers(users.filter((user) => user.id !== id)); // remove from UI
      })
      .catch((error) => console.error("Error deleting user:", error));
  };

  return (
    <div>
      <h2>Manage Users</h2>

      {/* Table */}
      <AdminTable
        headers={["#", "Name", "Email", "Actions"]}
        data={users}
        onEdit={(id) => {
          const user = users.find((u) => u.id === id);
          handleEdit(user);
        }}
        onDelete={(id) => handleDelete(id)}
      />

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Edit User</h3>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border p-2 mb-3 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingUser(null)}
                className="bg-gray-400 px-4 py-2 rounded text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 px-4 py-2 rounded text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
