/**
 * Employee Class - Manages employee records
 * Extends DataTable for reusable functionality
 */

import { DataTable } from './DataTable.js';

export class Employee extends DataTable {
    constructor() {
        // Configuration for employees
        const config = {
            apiUrl: 'http://localhost:3000/employees',
            entityName: 'Employee',
            columns: [
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'position', label: 'Position' },
                { key: 'department', label: 'Department' },
                { key: 'hireDate', label: 'Hire Date' }
            ],
            formFields: [
                {
                    name: 'name',
                    label: 'Full Name',
                    type: 'text',
                    required: true
                },
                {
                    name: 'email',
                    label: 'Email Address',
                    type: 'email',
                    required: true
                },
                {
                    name: 'phone',
                    label: 'Phone Number',
                    type: 'tel',
                    required: true
                },
                {
                    name: 'position',
                    label: 'Position',
                    type: 'select',
                    required: true,
                    options: [
                        'Student Affairs Officer',
                        'Registration Coordinator',
                        'Academic Advisor',
                        'Admissions Officer',
                        'Financial Aid Officer',
                        'Records Manager',
                        'IT Support Specialist',
                        'Administrative Assistant',
                        'HR Manager',
                        'Facilities Manager'
                    ]
                },
                {
                    name: 'department',
                    label: 'Department',
                    type: 'select',
                    required: true,
                    options: [
                        'Administration',
                        'Admissions',
                        'Student Services',
                        'Financial Aid',
                        'Registrar',
                        'Human Resources',
                        'IT Department',
                        'Facilities',
                        'Academic Affairs',
                        'Student Affairs'
                    ]
                },
                {
                    name: 'hireDate',
                    label: 'Hire Date',
                    type: 'date',
                    required: true
                }
            ]
        };
        
        super(config);
    }
    
    /**
     * Initialize employee module
     */
    init() {
        this.loadData();
    }
    
    /**
     * Get all employees
     */
    async getAllEmployees() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) throw new Error('Failed to fetch employees');
            return await response.json();
        } catch (error) {
            console.error('Error fetching all employees:', error);
            return [];
        }
    }
    
    /**
     * Get employee by ID
     */
    async getEmployeeById(id) {
        try {
            const response = await fetch(`${this.apiUrl}/${id}`);
            if (!response.ok) throw new Error('Failed to fetch employee');
            return await response.json();
        } catch (error) {
            console.error('Error fetching employee:', error);
            return null;
        }
    }
    
    /**
     * Search employees by query
     */
    async searchEmployees(query) {
        try {
            const response = await fetch(`${this.apiUrl}?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Failed to search employees');
            return await response.json();
        } catch (error) {
            console.error('Error searching employees:', error);
            return [];
        }
    }
    
    /**
     * Filter employees by department
     */
    async filterByDepartment(department) {
        try {
            const response = await fetch(`${this.apiUrl}?department=${encodeURIComponent(department)}`);
            if (!response.ok) throw new Error('Failed to filter employees');
            return await response.json();
        } catch (error) {
            console.error('Error filtering employees:', error);
            return [];
        }
    }
    
    /**
     * Filter employees by position
     */
    async filterByPosition(position) {
        try {
            const response = await fetch(`${this.apiUrl}?position=${encodeURIComponent(position)}`);
            if (!response.ok) throw new Error('Failed to filter employees');
            return await response.json();
        } catch (error) {
            console.error('Error filtering employees by position:', error);
            return [];
        }
    }
    
    /**
     * Get employees hired after a specific date
     */
    async getEmployeesHiredAfter(date) {
        try {
            const response = await fetch(`${this.apiUrl}?hireDate_gte=${date}&_sort=hireDate&_order=desc`);
            if (!response.ok) throw new Error('Failed to fetch employees');
            return await response.json();
        } catch (error) {
            console.error('Error fetching employees by hire date:', error);
            return [];
        }
    }
    
    /**
     * Get senior employees (hired before 2020)
     */
    async getSeniorEmployees() {
        try {
            const response = await fetch(`${this.apiUrl}?hireDate_lte=2020-01-01&_sort=hireDate&_order=asc`);
            if (!response.ok) throw new Error('Failed to fetch senior employees');
            return await response.json();
        } catch (error) {
            console.error('Error fetching senior employees:', error);
            return [];
        }
    }
    
    /**
     * Get new employees (hired in current year)
     */
    async getNewEmployees() {
        try {
            const currentYear = new Date().getFullYear();
            const response = await fetch(`${this.apiUrl}?hireDate_gte=${currentYear}-01-01&_sort=hireDate&_order=desc`);
            if (!response.ok) throw new Error('Failed to fetch new employees');
            return await response.json();
        } catch (error) {
            console.error('Error fetching new employees:', error);
            return [];
        }
    }
    
    /**
     * Get employees in Student Affairs departments
     */
    async getStudentAffairsStaff() {
        try {
            const allEmployees = await this.getAllEmployees();
            return allEmployees.filter(employee => 
                employee.department && (
                    employee.department.includes('Student Affairs') ||
                    employee.department.includes('Student Services') ||
                    employee.department.includes('Admissions') ||
                    employee.department.includes('Academic Affairs')
                )
            );
        } catch (error) {
            console.error('Error fetching student affairs staff:', error);
            return [];
        }
    }
    
    /**
     * Calculate years of service for an employee
     */
    calculateYearsOfService(hireDate) {
        const hire = new Date(hireDate);
        const today = new Date();
        const years = today.getFullYear() - hire.getFullYear();
        const monthDiff = today.getMonth() - hire.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < hire.getDate())) {
            return years - 1;
        }
        return years;
    }
    
    /**
     * Validate employee data before saving
     */
    validateEmployee(data) {
        const errors = [];
        
        // Name validation
        if (!data.name || data.name.trim().length < 3) {
            errors.push('Name must be at least 3 characters long');
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        // University email check (optional but recommended)
        if (data.email && !data.email.includes('university.edu') && !data.email.includes('.edu')) {
            console.warn('Email does not appear to be a university email');
        }
        
        // Phone validation (basic)
        if (!data.phone || data.phone.trim().length < 10) {
            errors.push('Please enter a valid phone number');
        }
        
        // Position validation
        if (!data.position || data.position.trim() === '') {
            errors.push('Please select a position');
        }
        
        // Department validation
        if (!data.department || data.department.trim() === '') {
            errors.push('Please select a department');
        }
        
        // Hire date validation
        if (!data.hireDate) {
            errors.push('Please enter hire date');
        } else {
            const hireDate = new Date(data.hireDate);
            const today = new Date();
            const minDate = new Date('2000-01-01');
            
            if (hireDate > today) {
                errors.push('Hire date cannot be in the future');
            }
            if (hireDate < minDate) {
                errors.push('Hire date seems too old (before 2000)');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    /**
     * Override saveRecord to include validation
     */
    async saveRecord() {
        try {
            const formData = new FormData(this.recordForm);
            const data = Object.fromEntries(formData.entries());
            
            // Validate data
            const validation = this.validateEmployee(data);
            if (!validation.isValid) {
                alert('Validation errors:\n' + validation.errors.join('\n'));
                return;
            }
            
            let response;
            
            if (this.currentRecord) {
                // Update existing record
                response = await fetch(`${this.apiUrl}/${this.currentRecord.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...data, id: this.currentRecord.id })
                });
            } else {
                // Create new record
                response = await fetch(this.apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }
            
            if (!response.ok) throw new Error('Failed to save employee');
            
            this.closeModal();
            this.loadData();
            
        } catch (error) {
            console.error('Error saving employee:', error);
            alert('Failed to save employee. Please try again.');
        }
    }
}
