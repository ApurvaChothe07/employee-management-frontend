import api from './api';

/**
 * Employee Management Service
 * Communicates with backend EmployeeController endpoints:
 * - GET    /api/employees
 * - GET    /api/employees/{id}
 * - POST   /api/employees
 * - PUT    /api/employees/{id}
 * - DELETE /api/employees/{id}
 *
 * All operations require ROLE_ADMIN authority in Spring Security.
 */
export const employeeService = {
  /**
   * Fetch all employees
   * @returns {Promise<Array<object>>} List of EmployeeResponseDTO
   */
  async getAllEmployees() {
    const response = await api.get('/api/employees');
    return response.data;
  },

  /**
   * Fetch a single employee by their ID
   * @param {number|string} id
   * @returns {Promise<object>} EmployeeResponseDTO
   */
  async getEmployeeById(id) {
    const response = await api.get(`/api/employees/${id}`);
    return response.data;
  },

  /**
   * Create a new employee record
   * @param {object} employeeData - Matches EmployeeRequestDTO
   * @returns {Promise<object>} Created EmployeeResponseDTO
   */
  async createEmployee(employeeData) {
    const response = await api.post('/api/employees', employeeData);
    return response.data;
  },

  /**
   * Update an existing employee record
   * @param {number|string} id
   * @param {object} employeeData - Matches EmployeeRequestDTO
   * @returns {Promise<object>} Updated EmployeeResponseDTO
   */
  async updateEmployee(id, employeeData) {
    const response = await api.put(`/api/employees/${id}`, employeeData);
    return response.data;
  },

  /**
   * Delete an employee record by ID
   * @param {number|string} id
   * @returns {Promise<void>}
   */
  async deleteEmployee(id) {
    const response = await api.delete(`/api/employees/${id}`);
    return response.data;
  }
};

export default employeeService;
