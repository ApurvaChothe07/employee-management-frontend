import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import employeeService from '../services/employeeService';

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    salary: ''
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departmentOptions = [
    'Engineering',
    'Human Resources',
    'Finance',
    'Marketing',
    'Sales',
    'Operations',
    'Legal',
    'Product Management'
  ];

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id || isNaN(Number(id))) {
        setNotFound(true);
        setInitialLoading(false);
        return;
      }

      setInitialLoading(true);
      setServerError('');
      try {
        const emp = await employeeService.getEmployeeById(id);
        setFormData({
          firstName: emp.firstName || '',
          lastName: emp.lastName || '',
          email: emp.email || '',
          phone: emp.phone || '',
          department: emp.department || '',
          designation: emp.designation || '',
          salary: emp.salary !== undefined && emp.salary !== null ? String(emp.salary) : ''
        });
      } catch (err) {
        console.error('Failed to load employee:', err);
        if (err.status === 404) {
          setNotFound(true);
        } else {
          setServerError(err.message || 'Failed to retrieve employee record.');
        }
      } finally {
        setInitialLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    const emailTrimmed = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrimmed) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(emailTrimmed)) {
      errors.email = 'Enter a valid email address';
    }

    if (!formData.department.trim()) {
      errors.department = 'Department is required';
    }

    if (!formData.designation.trim()) {
      errors.designation = 'Designation is required';
    }

    const salaryNum = parseFloat(formData.salary);
    if (!formData.salary || isNaN(salaryNum)) {
      errors.salary = 'Salary is required';
    } else if (salaryNum <= 0) {
      errors.salary = 'Salary must be greater than 0';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        department: formData.department.trim(),
        designation: formData.designation.trim(),
        salary: parseFloat(formData.salary)
      };

      await employeeService.updateEmployee(id, payload);
      navigate('/employees');
    } catch (err) {
      console.error('Failed to update employee:', err);
      setServerError(err.message || 'Failed to update employee record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title={`Edit Employee #${id}`}>
      <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '1.5rem' }}>
        <Link to="/employees" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          ← Back to Employee Directory
        </Link>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '0.5rem' }}>
          Update Employee #{id}
        </h1>
      </div>

      {initialLoading ? (
        <div className="card form-card">
          <Loading message="Loading employee record..." />
        </div>
      ) : notFound ? (
        <div className="card form-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔎</div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Employee Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            We could not locate an employee record with ID <strong>#{id}</strong>.
          </p>
          <Link to="/employees" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            Return to Directory
          </Link>
        </div>
      ) : (
        <div className="card form-card">
          <ErrorMessage message={serverError} onDismiss={() => setServerError('')} />

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              {/* First Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="edit-firstName">
                  First Name <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  id="edit-firstName"
                  name="firstName"
                  type="text"
                  className={`form-input ${formErrors.firstName ? 'input-error' : ''}`}
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {formErrors.firstName && (
                  <span className="error-text">{formErrors.firstName}</span>
                )}
              </div>

              {/* Last Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="edit-lastName">
                  Last Name <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  id="edit-lastName"
                  name="lastName"
                  type="text"
                  className={`form-input ${formErrors.lastName ? 'input-error' : ''}`}
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {formErrors.lastName && (
                  <span className="error-text">{formErrors.lastName}</span>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="edit-email">
                  Corporate Email <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  id="edit-email"
                  name="email"
                  type="email"
                  className={`form-input ${formErrors.email ? 'input-error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {formErrors.email && (
                  <span className="error-text">{formErrors.email}</span>
                )}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label" htmlFor="edit-phone">
                  Phone Number (Optional)
                </label>
                <input
                  id="edit-phone"
                  name="phone"
                  type="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              {/* Department */}
              <div className="form-group">
                <label className="form-label" htmlFor="edit-department">
                  Department <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  id="edit-department"
                  name="department"
                  list="edit-dept-suggestions"
                  type="text"
                  className={`form-input ${formErrors.department ? 'input-error' : ''}`}
                  value={formData.department}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <datalist id="edit-dept-suggestions">
                  {departmentOptions.map((dept) => (
                    <option key={dept} value={dept} />
                  ))}
                </datalist>
                {formErrors.department && (
                  <span className="error-text">{formErrors.department}</span>
                )}
              </div>

              {/* Designation */}
              <div className="form-group">
                <label className="form-label" htmlFor="edit-designation">
                  Designation / Title <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  id="edit-designation"
                  name="designation"
                  type="text"
                  className={`form-input ${formErrors.designation ? 'input-error' : ''}`}
                  value={formData.designation}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {formErrors.designation && (
                  <span className="error-text">{formErrors.designation}</span>
                )}
              </div>

              {/* Salary */}
              <div className="form-group">
                <label className="form-label" htmlFor="edit-salary">
                  Annual Salary (USD) <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  id="edit-salary"
                  name="salary"
                  type="number"
                  step="0.01"
                  min="0"
                  className={`form-input ${formErrors.salary ? 'input-error' : ''}`}
                  value={formData.salary}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {formErrors.salary && (
                  <span className="error-text">{formErrors.salary}</span>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/employees')}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner spinner-sm" />
                    Updating Record...
                  </>
                ) : (
                  'Update Employee'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}
