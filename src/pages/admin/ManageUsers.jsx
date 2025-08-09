// src/pages/admin/ManageUsers.jsx
import React from "react";
import AdminTable from "../../components/admin/AdminTable";

function ManageUsers() {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ];

  return (
    <div>
      <h2>Manage Users</h2>
      <AdminTable
        headers={["#", "Name", "Email", "Actions"]}
        data={users}
        onEdit={(id) => console.log("Edit user", id)}
        onDelete={(id) => console.log("Delete user", id)}
      />
    </div>
  );
}

export default ManageUsers;
