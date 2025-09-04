// src/components/admin/AdminTable.jsx
import React from "react";
import styles from "./AdminTable.module.css";

function AdminTable({ headers, data, onEdit, onDelete }) {
  return (
    <table className={`${styles.table} ${styles.tableStriped}`}>
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
                className={`${styles.btn} ${styles.btnWarning} ${styles.btnSm}`}
                onClick={() => onEdit(row.id)}
              >
                Edit
              </button>
              <button
                className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
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
