/**
 * Course Class - Manages course records
 * Extends DataTable for reusable functionality
 */

import { DataTable } from './DataTable.js';

export class Course extends DataTable {
    constructor() {
        // Configuration for courses
        const config = {
            apiUrl: 'http://localhost:3000/courses',
            entityName: 'Course',
            columns: [
                { key: 'id', label: 'ID' },
                { key: 'code', label: 'Course Code' },
                { key: 'name', label: 'Course Name' },
                { key: 'credits', label: 'Credits' },
                { key: 'department', label: 'Department' },
                { key: 'instructor', label: 'Instructor' }
            ],
            formFields: [
                {
                    name: 'code',
                    label: 'Course Code',
                    type: 'text',
                    required: true
                },
                {
                    name: 'name',
                    label: 'Course Name',
                    type: 'text',
                    required: true
                },
                {
                    name: 'credits',
                    label: 'Credit Hours',
                    type: 'number',
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
                    name: 'instructor',
                    label: 'Instructor Name',
                    type: 'text',
                    required: true
                }
            ]
        };
        
        super(config);
    }
    
    /**
     * Initialize course module
     */
    init() {
        this.loadData();
    }
    
    /**
     * Get all courses
     */
    async getAllCourses() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) throw new Error('Failed to fetch courses');
            return await response.json();
        } catch (error) {
            console.error('Error fetching all courses:', error);
            return [];
        }
    }
    
    /**
     * Get course by ID
     */
    async getCourseById(id) {
        try {
            const response = await fetch(`${this.apiUrl}/${id}`);
            if (!response.ok) throw new Error('Failed to fetch course');
            return await response.json();
        } catch (error) {
            console.error('Error fetching course:', error);
            return null;
        }
    }
    
    /**
     * Get course by code
     */
    async getCourseByCode(code) {
        try {
            const response = await fetch(`${this.apiUrl}?code=${encodeURIComponent(code)}`);
            if (!response.ok) throw new Error('Failed to fetch course');
            const courses = await response.json();
            return courses.length > 0 ? courses[0] : null;
        } catch (error) {
            console.error('Error fetching course by code:', error);
            return null;
        }
    }
    
    /**
     * Search courses by query
     */
    async searchCourses(query) {
        try {
            const response = await fetch(`${this.apiUrl}?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Failed to search courses');
            return await response.json();
        } catch (error) {
            console.error('Error searching courses:', error);
            return [];
        }
    }
    
    /**
     * Filter courses by department
     */
    async filterByDepartment(department) {
        try {
            const response = await fetch(`${this.apiUrl}?department=${encodeURIComponent(department)}`);
            if (!response.ok) throw new Error('Failed to filter courses');
            return await response.json();
        } catch (error) {
            console.error('Error filtering courses:', error);
            return [];
        }
    }
    
    /**
     * Filter courses by instructor
     */
    async filterByInstructor(instructor) {
        try {
            const response = await fetch(`${this.apiUrl}?instructor=${encodeURIComponent(instructor)}`);
            if (!response.ok) throw new Error('Failed to filter courses');
            return await response.json();
        } catch (error) {
            console.error('Error filtering courses by instructor:', error);
            return [];
        }
    }
    
    /**
     * Get courses by credit hours
     */
    async getCoursesByCredits(credits) {
        try {
            const response = await fetch(`${this.apiUrl}?credits=${credits}`);
            if (!response.ok) throw new Error('Failed to fetch courses');
            return await response.json();
        } catch (error) {
            console.error('Error fetching courses by credits:', error);
            return [];
        }
    }
    
    /**
     * Validate course data before saving
     */
    validateCourse(data) {
        const errors = [];
        
        // Course code validation
        const codeRegex = /^[A-Z]{2,4}\d{3}$/;
        if (!data.code || !codeRegex.test(data.code.toUpperCase())) {
            errors.push('Course code must be in format: CS101, ENG201, BUS301, etc.');
        }
        
        // Course name validation
        if (!data.name || data.name.trim().length < 5) {
            errors.push('Course name must be at least 5 characters long');
        }
        
        // Credits validation
        const credits = parseInt(data.credits);
        if (isNaN(credits) || credits < 1 || credits > 6) {
            errors.push('Credit hours must be between 1 and 6');
        }
        
        // Department validation
        if (!data.department || data.department.trim() === '') {
            errors.push('Please select a department');
        }
        
        // Instructor validation
        if (!data.instructor || data.instructor.trim().length < 3) {
            errors.push('Instructor name must be at least 3 characters long');
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
            const validation = this.validateCourse(data);
            if (!validation.isValid) {
                alert('Validation errors:\n' + validation.errors.join('\n'));
                return;
            }
            
            // Format course code to uppercase
            data.code = data.code.toUpperCase();
            
            // Convert credits to number
            data.credits = parseInt(data.credits);
            
            // Check if course code already exists (only for new courses)
            if (!this.currentRecord) {
                const existingCourse = await this.getCourseByCode(data.code);
                if (existingCourse) {
                    alert(`Course code ${data.code} already exists!`);
                    return;
                }
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
            
            if (!response.ok) throw new Error('Failed to save course');
            
            this.closeModal();
            this.loadData();
            
        } catch (error) {
            console.error('Error saving course:', error);
            alert('Failed to save course. Please try again.');
        }
    }
}
