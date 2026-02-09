/**
 * Student Class - Manages student records
 * Extends DataTable for reusable functionality
 */

import { DataTable } from './DataTable.js';

export class Student extends DataTable {
    constructor() {
        // Configuration for students
        const config = {
            apiUrl: 'http://localhost:3000/students',
            entityName: 'Student',
            columns: [
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'department', label: 'Department' },
                { key: 'gpa', label: 'GPA' },
                { key: 'enrollmentDate', label: 'Enrollment Date' }
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
                    name: 'department',
                    label: 'Department',
                    type: 'select',
                    required: true,
                    options: [
                        'Computer Science',
                        'Engineering',
                        'Business',
                        'Medicine',
                        'Arts',
                        'Science'
                    ]
                },
                {
                    name: 'gpa',
                    label: 'GPA (0.0 - 4.0)',
                    type: 'number',
                    required: true
                },
                {
                    name: 'enrollmentDate',
                    label: 'Enrollment Date',
                    type: 'date',
                    required: true
                }
            ]
        };
        
        super(config);
    }
    
    /**
     * Initialize student module
     */
    init() {
        this.loadData();
    }
    
    /**
     * Get all students
     */
    async getAllStudents() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) throw new Error('Failed to fetch students');
            return await response.json();
        } catch (error) {
            console.error('Error fetching all students:', error);
            return [];
        }
    }
    
    /**
     * Get student by ID
     */
    async getStudentById(id) {
        try {
            const response = await fetch(`${this.apiUrl}/${id}`);
            if (!response.ok) throw new Error('Failed to fetch student');
            return await response.json();
        } catch (error) {
            console.error('Error fetching student:', error);
            return null;
        }
    }
    
    /**
     * Search students by query
     */
    async searchStudents(query) {
        try {
            const response = await fetch(`${this.apiUrl}?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Failed to search students');
            return await response.json();
        } catch (error) {
            console.error('Error searching students:', error);
            return [];
        }
    }
    
    /**
     * Filter students by department
     */
    async filterByDepartment(department) {
        try {
            const response = await fetch(`${this.apiUrl}?department=${encodeURIComponent(department)}`);
            if (!response.ok) throw new Error('Failed to filter students');
            return await response.json();
        } catch (error) {
            console.error('Error filtering students:', error);
            return [];
        }
    }
    
    /**
     * Get students with high GPA (>= 3.5)
     */
    async getHonorStudents() {
        try {
            const response = await fetch(`${this.apiUrl}?gpa_gte=3.5&_sort=gpa&_order=desc`);
            if (!response.ok) throw new Error('Failed to fetch honor students');
            return await response.json();
        } catch (error) {
            console.error('Error fetching honor students:', error);
            return [];
        }
    }
    
    /**
     * Validate student data before saving
     */
    validateStudent(data) {
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
        
        // Phone validation (basic)
        if (!data.phone || data.phone.trim().length < 10) {
            errors.push('Please enter a valid phone number');
        }
        
        // GPA validation
        const gpa = parseFloat(data.gpa);
        if (isNaN(gpa) || gpa < 0 || gpa > 4.0) {
            errors.push('GPA must be between 0.0 and 4.0');
        }
        
        // Department validation
        if (!data.department || data.department.trim() === '') {
            errors.push('Please select a department');
        }
        
        // Enrollment date validation
        if (!data.enrollmentDate) {
            errors.push('Please enter enrollment date');
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
            const validation = this.validateStudent(data);
            if (!validation.isValid) {
                alert('Validation errors:\n' + validation.errors.join('\n'));
                return;
            }
            
            // Convert GPA to number
            data.gpa = parseFloat(data.gpa);
            
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
            
            if (!response.ok) throw new Error('Failed to save student');
            
            this.closeModal();
            this.loadData();
            
        } catch (error) {
            console.error('Error saving student:', error);
            alert('Failed to save student. Please try again.');
        }
    }
}
