// src/components/admin/AdminTable.jsx
import React from "react";

function AdminTable({ headers, data, onEdit, onDelete }) {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={row.id}>
            <td>{i + 1}</td>
            <td>{row.name}</td>
            <td>{row.email}</td>
            <td>
              <button
                className="btn btn-warning btn-sm"
                onClick={() => onEdit(row.id)}
              >
                Edit
              </button>{" "}
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onDelete(row.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AdminTable;
