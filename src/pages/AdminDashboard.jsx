import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmDialog from '../components/ConfirmDialog';
import EmployeeTable from '../components/EmployeeTable';
import employeeService from '../services/employeeService';
import { useAuth } from '../hooks/useAuth';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Delete Dialog State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch employees for admin dashboard:', err);
      setError(err.message || 'Failed to load employee records from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Compute dashboard metrics
  const stats = useMemo(() => {
    const totalCount = employees.length;
    const departments = new Set(
      employees.map((e) => e.department).filter(Boolean)
    );
    const totalPayroll = employees.reduce((sum, e) => sum + (Number(e.salary) || 0), 0);
    const avgSalary = totalCount > 0 ? totalPayroll / totalCount : 0;

    return {
      totalCount,
      departmentCount: departments.size,
      totalPayroll,
      avgSalary,
      uniqueDepartments: Array.from(departments).sort()
    };
  }, [employees]);

  // Filtered employees for preview table
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        searchTerm === '' ||
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.email && emp.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (emp.designation && emp.designation.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDept =
        selectedDepartment === 'ALL' || emp.department === selectedDepartment;

      return matchesSearch && matchesDept;
    });
  }, [employees, searchTerm, selectedDepartment]);

  const handleDeleteClick = (emp) => {
    setDeleteTarget(emp);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setError('');
    try {
      await employeeService.deleteEmployee(deleteTarget.id);
      setSuccessMsg(`Employee ${deleteTarget.firstName} ${deleteTarget.lastName} was deleted successfully.`);
      setEmployees((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Delete employee failed:', err);
      setError(err.message || 'Failed to delete employee.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <DashboardLayout title="Administrator Portal">
      {/* Welcome Card */}
      <div className="welcome-card">
        <h1 className="welcome-title">Welcome back, {user?.username || 'Administrator'}!</h1>
        <p className="welcome-desc">
          Here is an overview of your organization's workforce metrics and employee directory.
        </p>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      {successMsg && (
        <div className="alert alert-success" role="alert">
          <span>✅</span>
          <div style={{ flex: 1 }}>{successMsg}</div>
          <button
            type="button"
            onClick={() => setSuccessMsg('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Metric Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-primary">👥</div>
          <div className="stat-info">
            <div className="stat-label">Total Employees</div>
            <div className="stat-value">{stats.totalCount}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-success">🏢</div>
          <div className="stat-info">
            <div className="stat-label">Departments</div>
            <div className="stat-value">{stats.departmentCount}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-warning">💰</div>
          <div className="stat-info">
            <div className="stat-label">Average Salary</div>
            <div className="stat-value">{formatCurrency(stats.avgSalary)}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-primary">💼</div>
          <div className="stat-info">
            <div className="stat-label">Total Payroll</div>
            <div className="stat-value">{formatCurrency(stats.totalPayroll)}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Directory Preview */}
      <div className="card">
        <div className="toolbar">
          <div className="toolbar-filters">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="ALL">All Departments ({stats.departmentCount})</option>
              {stats.uniqueDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/employees/new" className="btn btn-primary">
              <span>➕</span>
              <span>Add Employee</span>
            </Link>
            <Link to="/employees" className="btn btn-secondary">
              <span>View All ({stats.totalCount})</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <Loading message="Loading employee directory..." />
        ) : (
          <EmployeeTable
            employees={filteredEmployees}
            onDelete={handleDeleteClick}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Confirm Employee Deletion"
        message={`Are you sure you want to delete employee record "${deleteTarget?.firstName} ${deleteTarget?.lastName}"? This action cannot be undone.`}
        confirmText="Delete Record"
        cancelText="Cancel"
        isDanger={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </DashboardLayout>
  );
}
