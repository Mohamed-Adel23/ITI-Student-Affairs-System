/**
 * Dashboard Class - Main landing page with statistics and quick actions
 */

export class Dashboard {
    constructor() {
        this.statsData = {
            students: 0,
            courses: 0,
            instructors: 0,
            employees: 0
        };
    }
    
    /**
     * Initialize dashboard
     */
    async init() {
        await this.loadStatistics();
        this.render();
    }
    
    /**
     * Load statistics from all endpoints
     */
    async loadStatistics() {
        try {
            const [students, courses, instructors, employees] = await Promise.all([
                fetch('http://localhost:3000/students').then(r => r.json()),
                fetch('http://localhost:3000/courses').then(r => r.json()),
                fetch('http://localhost:3000/instructors').then(r => r.json()),
                fetch('http://localhost:3000/employees').then(r => r.json())
            ]);
            
            this.statsData = {
                students: students.length,
                courses: courses.length,
                instructors: instructors.length,
                employees: employees.length
            };
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    }
    
    /**
     * Render dashboard
     */
    render() {
        const container = document.querySelector('.main-content .container');
        
        const dashboardHTML = `
            <!-- Dashboard Hero -->
            <div class="dashboard-hero">
                <div class="hero-content">
                    <h1 class="hero-title">Welcome to Students Affairs System</h1>
                    <p class="hero-subtitle">Manage your university data efficiently and effectively</p>
                </div>
                <div class="hero-illustration">
                    <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                        <circle cx="100" cy="100" r="80" fill="var(--primary)" opacity="0.1"/>
                        <circle cx="100" cy="100" r="60" fill="var(--primary)" opacity="0.2"/>
                        <circle cx="100" cy="100" r="40" fill="var(--primary)" opacity="0.3"/>
                        <path d="M100 60L120 100L100 140L80 100L100 60Z" fill="var(--primary)"/>
                    </svg>
                </div>
            </div>
            
            <!-- Statistics Cards -->
            <div class="stats-grid">
                <div class="stat-card stat-students" data-page="students">
                    <div class="stat-icon">👨‍🎓</div>
                    <div class="stat-content">
                        <h3 class="stat-number">${this.statsData.students}</h3>
                        <p class="stat-label">Students</p>
                    </div>
                    <div class="stat-action">→</div>
                </div>
                
                <div class="stat-card stat-courses" data-page="courses">
                    <div class="stat-icon">📚</div>
                    <div class="stat-content">
                        <h3 class="stat-number">${this.statsData.courses}</h3>
                        <p class="stat-label">Courses</p>
                    </div>
                    <div class="stat-action">→</div>
                </div>
                
                <div class="stat-card stat-instructors" data-page="instructors">
                    <div class="stat-icon">👨‍🏫</div>
                    <div class="stat-content">
                        <h3 class="stat-number">${this.statsData.instructors}</h3>
                        <p class="stat-label">Instructors</p>
                    </div>
                    <div class="stat-action">→</div>
                </div>
                
                <div class="stat-card stat-employees" data-page="employees">
                    <div class="stat-icon">👔</div>
                    <div class="stat-content">
                        <h3 class="stat-number">${this.statsData.employees}</h3>
                        <p class="stat-label">Employees</p>
                    </div>
                    <div class="stat-action">→</div>
                </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="quick-actions-section">
                <h2 class="section-title">Quick Actions</h2>
                <div class="quick-actions-grid">
                    <button class="action-card" data-action="add-student">
                        <div class="action-icon">➕</div>
                        <h3 class="action-title">Add Student</h3>
                        <p class="action-desc">Register a new student</p>
                    </button>
                    
                    <button class="action-card" data-action="add-course">
                        <div class="action-icon">📖</div>
                        <h3 class="action-title">Add Course</h3>
                        <p class="action-desc">Create a new course</p>
                    </button>
                    
                    <button class="action-card" data-action="add-instructor">
                        <div class="action-icon">👤</div>
                        <h3 class="action-title">Add Instructor</h3>
                        <p class="action-desc">Register new instructor</p>
                    </button>
                    
                    <button class="action-card" data-action="add-employee">
                        <div class="action-icon">💼</div>
                        <h3 class="action-title">Add Employee</h3>
                        <p class="action-desc">Register new employee</p>
                    </button>
                </div>
            </div>
            
            <!-- System Overview -->
            <div class="system-overview">
                <h2 class="section-title">System Overview</h2>
                <div class="overview-grid">
                    <div class="overview-card">
                        <div class="overview-header">
                            <span class="overview-icon">📊</span>
                            <h3>Total Records</h3>
                        </div>
                        <p class="overview-number">${this.statsData.students + this.statsData.courses + this.statsData.instructors + this.statsData.employees}</p>
                        <p class="overview-label">Across all modules</p>
                    </div>
                    
                    <div class="overview-card">
                        <div class="overview-header">
                            <span class="overview-icon">🎯</span>
                            <h3>Most Active</h3>
                        </div>
                        <p class="overview-number">${this.getMostActive()}</p>
                        <p class="overview-label">Module with most records</p>
                    </div>
                    
                    <div class="overview-card">
                        <div class="overview-header">
                            <span class="overview-icon">✅</span>
                            <h3>Status</h3>
                        </div>
                        <p class="overview-number">Active</p>
                        <p class="overview-label">All systems operational</p>
                    </div>
                </div>
            </div>
            
            <!-- Features List -->
            <div class="features-section">
                <h2 class="section-title">System Features</h2>
                <div class="features-grid">
                    <div class="feature-item">
                        <span class="feature-icon">🔍</span>
                        <h4>Advanced Search</h4>
                        <p>Search across all fields instantly</p>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">📄</span>
                        <h4>Pagination</h4>
                        <p>Navigate through records easily</p>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">⬆️</span>
                        <h4>Smart Sorting</h4>
                        <p>Sort by any column, any direction</p>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">✏️</span>
                        <h4>Easy Editing</h4>
                        <p>Update records with one click</p>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">🛡️</span>
                        <h4>Validation</h4>
                        <p>Data integrity guaranteed</p>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">📱</span>
                        <h4>Responsive</h4>
                        <p>Works on all devices</p>
                    </div>
                </div>
            </div>
        `;
        
        // Hide default page elements
        document.querySelector('.page-header').style.display = 'none';
        document.querySelector('.toolbar').style.display = 'none';
        document.querySelector('.table-container').style.display = 'none';
        document.querySelector('.pagination').style.display = 'none';
        
        // Insert dashboard
        container.innerHTML = dashboardHTML;
        
        // Add event listeners
        this.attachEventListeners();
    }
    
    /**
     * Get most active module name
     */
    getMostActive() {
        const max = Math.max(
            this.statsData.students,
            this.statsData.courses,
            this.statsData.instructors,
            this.statsData.employees
        );
        
        if (max === this.statsData.students) return 'Students';
        if (max === this.statsData.courses) return 'Courses';
        if (max === this.statsData.instructors) return 'Instructors';
        if (max === this.statsData.employees) return 'Employees';
        return 'None';
    }
    
    /**
     * Attach event listeners to dashboard elements
     */
    attachEventListeners() {
        // Stat cards click to navigate
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('click', () => {
                const page = card.dataset.page;
                const navLink = document.querySelector(`.nav-link[data-page="${page}"]`);
                if (navLink) navLink.click();
            });
        });
        
        // Quick action buttons
        document.querySelectorAll('.action-card').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }
    
    /**
     * Handle quick action buttons
     */
    handleQuickAction(action) {
        const actionMap = {
            'add-student': 'students',
            'add-course': 'courses',
            'add-instructor': 'instructors',
            'add-employee': 'employees'
        };
        
        const page = actionMap[action];
        if (page) {
            // Navigate to the page
            const navLink = document.querySelector(`.nav-link[data-page="${page}"]`);
            if (navLink) {
                navLink.click();
                // Wait for page to load, then trigger add new
                setTimeout(() => {
                    const addBtn = document.getElementById('addNewBtn');
                    if (addBtn) addBtn.click();
                }, 300);
            }
        }
    }
}
