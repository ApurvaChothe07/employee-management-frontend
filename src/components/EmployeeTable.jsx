import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable Employee Table Component
 * @param {object} props
 * @param {Array} props.employees
 * @param {function} props.onDelete
 */
export default function EmployeeTable({ employees = [], onDelete }) {
  if (employees.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <div className="empty-state-title">No employees found</div>
        <p className="empty-state-desc">
          No employee records match your search criteria, or no employees have been created yet.
        </p>
      </div>
    );
  }

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(val);
  };

  return (
    <div className="table-container">
      <table className="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Salary</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => {
            const initial = emp.firstName ? emp.firstName.charAt(0).toUpperCase() : 'E';
            return (
              <tr key={emp.id}>
                <td>#{emp.id}</td>
                <td>
                  <div className="emp-name-cell">
                    <div className="emp-avatar">{initial}</div>
                    <div>
                      <div className="emp-fullname">{emp.firstName} {emp.lastName}</div>
                      <div className="emp-email">{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td>{emp.phone || '-'}</td>
                <td>
                  <span className="badge badge-department">{emp.department}</span>
                </td>
                <td>{emp.designation}</td>
                <td>{formatCurrency(emp.salary)}</td>
                <td>
                  <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                    <Link
                      to={`/employees/edit/${emp.id}`}
                      className="btn btn-secondary btn-sm"
                      title="Edit employee"
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(emp)}
                      title="Delete employee"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
