/**
 * Main Application Entry Point
 * Handles navigation and module initialization
 */

import { Student } from './modules/Student.js';
import { Course } from './modules/Course.js';
import { Instructor } from './modules/Instructor.js';
import { Employee } from './modules/Employee.js';

// Global state
let currentModule = null;
let currentPage = 'students';

// Page configurations
const pageConfig = {
    students: {
        title: 'Students Management',
        subtitle: 'View, add, edit, and manage all student records',
        icon: '👨‍🎓'
    },
    courses: {
        title: 'Courses Management',
        subtitle: 'Manage course catalog and course information',
        icon: '📚'
    },
    instructors: {
        title: 'Instructors Management',
        subtitle: 'Manage faculty and instructor information',
        icon: '👨‍🏫'
    },
    employees: {
        title: 'Employees Management',
        subtitle: 'Manage staff and employee records',
        icon: '👔'
    }
};

/**
 * Initialize the application
 */
function init() {
    console.log('🚀 Students Affairs System initialized!');
    
    // Setup navigation
    setupNavigation();
    
    // Load initial page (students)
    loadPage('students');
}

/**
 * Setup navigation event listeners
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const page = link.dataset.page;
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Load page
            loadPage(page);
        });
    });
}

/**
 * Load a specific page/module
 */
function loadPage(page) {
    currentPage = page;
    
    // Update page header
    updatePageHeader(page);
    
    // Clean up previous module
    if (currentModule) {
        // Cleanup if needed
        currentModule = null;
    }
    
    // Initialize the appropriate module
    switch (page) {
        case 'students':
            initStudentsModule();
            break;
        case 'courses':
            initCoursesModule();
            break;
        case 'instructors':
            initInstructorsModule();
            break;
        case 'employees':
            initEmployeesModule();
            break;
        default:
            console.error('Unknown page:', page);
    }
}

/**
 * Update page header with title and subtitle
 */
function updatePageHeader(page) {
    const config = pageConfig[page];
    
    if (config) {
        document.getElementById('pageTitle').textContent = config.title;
        document.getElementById('pageSubtitle').textContent = config.subtitle;
    }
}

/**
 * Initialize Students Module
 */
function initStudentsModule() {
    console.log('📚 Loading Students Module...');
    
    try {
        currentModule = new Student();
        currentModule.init();
        console.log('✅ Students Module loaded successfully!');
    } catch (error) {
        console.error('❌ Error loading Students Module:', error);
        showError('Failed to load Students module. Please refresh the page.');
    }
}

/**
 * Initialize Courses Module
 */
function initCoursesModule() {
    console.log('📖 Loading Courses Module...');
    
    try {
        currentModule = new Course();
        currentModule.init();
        console.log('✅ Courses Module loaded successfully!');
    } catch (error) {
        console.error('❌ Error loading Courses Module:', error);
        showError('Failed to load Courses module. Please refresh the page.');
    }
}

/**
 * Initialize Instructors Module
 */
function initInstructorsModule() {
    console.log('👨‍🏫 Loading Instructors Module...');
    
    try {
        currentModule = new Instructor();
        currentModule.init();
        console.log('✅ Instructors Module loaded successfully!');
    } catch (error) {
        console.error('❌ Error loading Instructors Module:', error);
        showError('Failed to load Instructors module. Please refresh the page.');
    }
}

/**
 * Initialize Employees Module
 */
function initEmployeesModule() {
    console.log('👔 Loading Employees Module...');
    
    try {
        currentModule = new Employee();
        currentModule.init();
        console.log('✅ Employees Module loaded successfully!');
    } catch (error) {
        console.error('❌ Error loading Employees Module:', error);
        showError('Failed to load Employees module. Please refresh the page.');
    }
}

/**
 * Show "Coming Soon" message for modules not yet implemented
 */
function showComingSoon(moduleName) {
    const tableElement = document.getElementById('dataTable');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');
    
    loadingSpinner.style.display = 'none';
    errorMessage.style.display = 'none';
    
    tableElement.innerHTML = `
        <tbody>
            <tr>
                <td style="text-align: center; padding: 4rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🚧</div>
                    <h3 style="font-family: var(--font-display); font-size: 1.8rem; margin-bottom: 0.5rem; color: var(--secondary);">
                        ${moduleName} Module Coming Soon!
                    </h3>
                    <p style="color: var(--text-secondary); font-size: 1rem;">
                        This module will be implemented in the next steps.
                    </p>
                </td>
            </tr>
        </tbody>
    `;
    
    tableElement.style.display = 'table';
}

/**
 * Show error message
 */
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const tableElement = document.getElementById('dataTable');
    
    loadingSpinner.style.display = 'none';
    tableElement.style.display = 'none';
    errorMessage.style.display = 'flex';
    errorText.textContent = message;
}

/**
 * Check if json-server is running
 */
async function checkServerStatus() {
    try {
        const response = await fetch('http://localhost:3000/students?_limit=1');
        if (response.ok) {
            console.log('✅ json-server is running');
            return true;
        }
    } catch (error) {
        console.error('❌ json-server is not running!');
        console.log('💡 Start it with: json-server --watch data/db.json --port 3000');
        
        showError(
            'Cannot connect to the server. Please make sure json-server is running.\n\n' +
            'Run: json-server --watch data/db.json --port 3000'
        );
        return false;
    }
    return false;
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        checkServerStatus().then(isRunning => {
            if (isRunning) {
                init();
            }
        });
    });
} else {
    checkServerStatus().then(isRunning => {
        if (isRunning) {
            init();
        }
    });
}

// Export for debugging in console
window.app = {
    loadPage,
    currentPage: () => currentPage,
    currentModule: () => currentModule
};
