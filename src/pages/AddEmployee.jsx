import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import ErrorMessage from '../components/ErrorMessage';
import employeeService from '../services/employeeService';

export default function AddEmployee() {
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

      await employeeService.createEmployee(payload);
      navigate('/employees');
    } catch (err) {
      console.error('Failed to create employee:', err);
      setServerError(err.message || 'Failed to create employee. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Add New Employee">
      <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '1.5rem' }}>
        <Link to="/employees" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          ← Back to Employee Directory
        </Link>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '0.5rem' }}>
          Create Employee Record
        </h1>
      </div>

      <div className="card form-card">
        <ErrorMessage message={serverError} onDismiss={() => setServerError('')} />

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            {/* First Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="firstName">
                First Name <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                className={`form-input ${formErrors.firstName ? 'input-error' : ''}`}
                placeholder="e.g. John"
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
              <label className="form-label" htmlFor="lastName">
                Last Name <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className={`form-input ${formErrors.lastName ? 'input-error' : ''}`}
                placeholder="e.g. Doe"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {formErrors.lastName && (
                <span className="error-text">{formErrors.lastName}</span>
              )}
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Corporate Email <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`form-input ${formErrors.email ? 'input-error' : ''}`}
                placeholder="e.g. john.doe@company.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {formErrors.email && (
                <span className="error-text">{formErrors.email}</span>
              )}
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="form-input"
                placeholder="e.g. +1 555-0123"
                value={formData.phone}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Department */}
            <div className="form-group">
              <label className="form-label" htmlFor="department">
                Department <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                id="department"
                name="department"
                list="department-suggestions"
                type="text"
                className={`form-input ${formErrors.department ? 'input-error' : ''}`}
                placeholder="Select or enter department"
                value={formData.department}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <datalist id="department-suggestions">
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
              <label className="form-label" htmlFor="designation">
                Designation / Title <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                id="designation"
                name="designation"
                type="text"
                className={`form-input ${formErrors.designation ? 'input-error' : ''}`}
                placeholder="e.g. Senior Software Engineer"
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
              <label className="form-label" htmlFor="salary">
                Annual Salary (USD) <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                id="salary"
                name="salary"
                type="number"
                step="0.01"
                min="0"
                className={`form-input ${formErrors.salary ? 'input-error' : ''}`}
                placeholder="e.g. 85000"
                value={formData.salary}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {formErrors.salary && (
                <span className="error-text">{formErrors.salary}</span>
              )}
            </div>
          </div>

          {/* Form Buttons */}
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
                  Saving Record...
                </>
              ) : (
                'Save Employee'
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
