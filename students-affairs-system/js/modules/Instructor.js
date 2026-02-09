/**
 * Instructor Class - Manages instructor records
 * Extends DataTable for reusable functionality
 */

import { DataTable } from './DataTable.js';

export class Instructor extends DataTable {
    constructor() {
        // Configuration for instructors
        const config = {
            apiUrl: 'http://localhost:3000/instructors',
            entityName: 'Instructor',
            columns: [
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'department', label: 'Department' },
                { key: 'specialization', label: 'Specialization' },
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
                        'Science',
                        'Mathematics',
                        'Physics',
                        'Chemistry',
                        'Biology'
                    ]
                },
                {
                    name: 'specialization',
                    label: 'Specialization',
                    type: 'text',
                    required: true
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
     * Initialize instructor module
     */
    init() {
        this.loadData();
    }
    
    /**
     * Get all instructors
     */
    async getAllInstructors() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) throw new Error('Failed to fetch instructors');
            return await response.json();
        } catch (error) {
            console.error('Error fetching all instructors:', error);
            return [];
        }
    }
    
    /**
     * Get instructor by ID
     */
    async getInstructorById(id) {
        try {
            const response = await fetch(`${this.apiUrl}/${id}`);
            if (!response.ok) throw new Error('Failed to fetch instructor');
            return await response.json();
        } catch (error) {
            console.error('Error fetching instructor:', error);
            return null;
        }
    }
    
    /**
     * Search instructors by query
     */
    async searchInstructors(query) {
        try {
            const response = await fetch(`${this.apiUrl}?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Failed to search instructors');
            return await response.json();
        } catch (error) {
            console.error('Error searching instructors:', error);
            return [];
        }
    }
    
    /**
     * Filter instructors by department
     */
    async filterByDepartment(department) {
        try {
            const response = await fetch(`${this.apiUrl}?department=${encodeURIComponent(department)}`);
            if (!response.ok) throw new Error('Failed to filter instructors');
            return await response.json();
        } catch (error) {
            console.error('Error filtering instructors:', error);
            return [];
        }
    }
    
    /**
     * Filter instructors by specialization
     */
    async filterBySpecialization(specialization) {
        try {
            const response = await fetch(`${this.apiUrl}?specialization=${encodeURIComponent(specialization)}`);
            if (!response.ok) throw new Error('Failed to filter instructors');
            return await response.json();
        } catch (error) {
            console.error('Error filtering instructors by specialization:', error);
            return [];
        }
    }
    
    /**
     * Get instructors hired after a specific date
     */
    async getInstructorsHiredAfter(date) {
        try {
            const response = await fetch(`${this.apiUrl}?hireDate_gte=${date}&_sort=hireDate&_order=desc`);
            if (!response.ok) throw new Error('Failed to fetch instructors');
            return await response.json();
        } catch (error) {
            console.error('Error fetching instructors by hire date:', error);
            return [];
        }
    }
    
    /**
     * Get senior instructors (hired before 2018)
     */
    async getSeniorInstructors() {
        try {
            const response = await fetch(`${this.apiUrl}?hireDate_lte=2018-01-01&_sort=hireDate&_order=asc`);
            if (!response.ok) throw new Error('Failed to fetch senior instructors');
            return await response.json();
        } catch (error) {
            console.error('Error fetching senior instructors:', error);
            return [];
        }
    }
    
    /**
     * Get instructors by email domain
     */
    async getInstructorsByEmailDomain(domain) {
        try {
            const allInstructors = await this.getAllInstructors();
            return allInstructors.filter(instructor => 
                instructor.email && instructor.email.includes(domain)
            );
        } catch (error) {
            console.error('Error filtering instructors by email domain:', error);
            return [];
        }
    }
    
    /**
     * Validate instructor data before saving
     */
    validateInstructor(data) {
        const errors = [];
        
        // Name validation (should include title like Dr.)
        if (!data.name || data.name.trim().length < 5) {
            errors.push('Name must be at least 5 characters long (include title: Dr., Prof., etc.)');
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
        
        // Department validation
        if (!data.department || data.department.trim() === '') {
            errors.push('Please select a department');
        }
        
        // Specialization validation
        if (!data.specialization || data.specialization.trim().length < 3) {
            errors.push('Specialization must be at least 3 characters long');
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
            const validation = this.validateInstructor(data);
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
            
            if (!response.ok) throw new Error('Failed to save instructor');
            
            this.closeModal();
            this.loadData();
            
        } catch (error) {
            console.error('Error saving instructor:', error);
            alert('Failed to save instructor. Please try again.');
        }
    }
}
