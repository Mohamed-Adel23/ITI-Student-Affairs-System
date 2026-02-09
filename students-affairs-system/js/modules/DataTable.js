/**
 * DataTable Class - Reusable component for displaying data in tables
 * Handles: Rendering, Pagination, Search, Sort, CRUD operations
 */

export class DataTable {
    constructor(config) {
        this.apiUrl = config.apiUrl;
        this.entityName = config.entityName;
        this.columns = config.columns;
        this.formFields = config.formFields;
        
        // Pagination
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.totalItems = 0;
        this.totalPages = 0;
        
        // Sorting
        this.sortColumn = null;
        this.sortOrder = 'asc';
        
        // Search
        this.searchQuery = '';
        
        // Current data
        this.data = [];
        this.currentRecord = null;
        
        // DOM Elements
        this.tableElement = document.getElementById('dataTable');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.errorMessage = document.getElementById('errorMessage');
        this.searchInput = document.getElementById('searchInput');
        this.itemsPerPageSelect = document.getElementById('itemsPerPage');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.paginationInfo = document.getElementById('paginationInfo');
        this.addNewBtn = document.getElementById('addNewBtn');
        
        // Modal Elements
        this.formModal = document.getElementById('formModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.recordForm = document.getElementById('recordForm');
        this.modalClose = document.getElementById('modalClose');
        this.modalOverlay = document.getElementById('modalOverlay');
        this.cancelBtn = document.getElementById('cancelBtn');
        
        // Delete Modal
        this.deleteModal = document.getElementById('deleteModal');
        this.deleteModalOverlay = document.getElementById('deleteModalOverlay');
        this.deleteModalClose = document.getElementById('deleteModalClose');
        this.deleteCancelBtn = document.getElementById('deleteCancelBtn');
        this.deleteConfirmBtn = document.getElementById('deleteConfirmBtn');
        this.recordToDelete = null;
        
        this.initEventListeners();
    }
    
    /**
     * Initialize all event listeners
     */
    initEventListeners() {
        // Search
        this.searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.currentPage = 1;
            this.loadData();
        });
        
        // Items per page
        this.itemsPerPageSelect.addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.loadData();
        });
        
        // Pagination
        this.prevBtn.addEventListener('click', () => this.previousPage());
        this.nextBtn.addEventListener('click', () => this.nextPage());
        
        // Add New
        this.addNewBtn.addEventListener('click', () => this.openAddModal());
        
        // Modal Close
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.modalOverlay.addEventListener('click', () => this.closeModal());
        this.cancelBtn.addEventListener('click', () => this.closeModal());
        
        // Delete Modal
        this.deleteModalClose.addEventListener('click', () => this.closeDeleteModal());
        this.deleteModalOverlay.addEventListener('click', () => this.closeDeleteModal());
        this.deleteCancelBtn.addEventListener('click', () => this.closeDeleteModal());
        this.deleteConfirmBtn.addEventListener('click', () => this.confirmDelete());
        
        // Form Submit
        this.recordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveRecord();
        });
    }
    
    /**
     * Load data from API
     */
    async loadData() {
        try {
            this.showLoading();
            this.hideError();
            
            // Build query parameters
            let url = `${this.apiUrl}?_page=${this.currentPage}&_limit=${this.itemsPerPage}`;
            
            if (this.searchQuery) {
                url += `&q=${encodeURIComponent(this.searchQuery)}`;
            }
            
            if (this.sortColumn) {
                url += `&_sort=${this.sortColumn}&_order=${this.sortOrder}`;
            }
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.data = await response.json();
            
            // Get total count from headers
            const totalCount = response.headers.get('X-Total-Count');
            this.totalItems = totalCount ? parseInt(totalCount) : this.data.length;
            this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
            
            this.renderTable();
            this.updatePagination();
            this.hideLoading();
            
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load data. Please check if json-server is running.');
            this.hideLoading();
        }
    }
    
    /**
     * Render table with data
     */
    renderTable() {
        if (this.data.length === 0) {
            this.tableElement.innerHTML = `
                <tbody>
                    <tr>
                        <td colspan="${this.columns.length + 1}" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                            No records found. Click "Add New" to create one!
                        </td>
                    </tr>
                </tbody>
            `;
            return;
        }
        
        // Create table header
        let headerHtml = '<thead><tr>';
        this.columns.forEach(column => {
            const sortClass = this.sortColumn === column.key ? 
                (this.sortOrder === 'asc' ? 'sorted-asc' : 'sorted-desc') : '';
            headerHtml += `<th class="sortable ${sortClass}" data-column="${column.key}">${column.label}</th>`;
        });
        headerHtml += '<th>Actions</th></tr></thead>';
        
        // Create table body
        let bodyHtml = '<tbody>';
        this.data.forEach(record => {
            bodyHtml += '<tr>';
            this.columns.forEach(column => {
                const value = record[column.key] || '-';
                bodyHtml += `<td>${value}</td>`;
            });
            bodyHtml += `
                <td>
                    <div class="table-actions">
                        <button class="action-btn edit-btn" data-id="${record.id}">Edit</button>
                        <button class="action-btn delete-btn" data-id="${record.id}">Delete</button>
                    </div>
                </td>
            `;
            bodyHtml += '</tr>';
        });
        bodyHtml += '</tbody>';
        
        this.tableElement.innerHTML = headerHtml + bodyHtml;
        
        // Add event listeners for column sorting
        this.tableElement.querySelectorAll('th.sortable').forEach(th => {
            th.addEventListener('click', (e) => {
                const column = e.target.dataset.column;
                this.sortBy(column);
            });
        });
        
        // Add event listeners for edit/delete buttons
        this.tableElement.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                this.openEditModal(id);
            });
        });
        
        this.tableElement.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                this.openDeleteModal(id);
            });
        });
    }
    
    /**
     * Sort table by column
     */
    sortBy(column) {
        if (this.sortColumn === column) {
            // Toggle sort order
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortOrder = 'asc';
        }
        this.loadData();
    }
    
    /**
     * Update pagination controls
     */
    updatePagination() {
        // Update info text
        const start = (this.currentPage - 1) * this.itemsPerPage + 1;
        const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
        this.paginationInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
        
        // Update button states
        this.prevBtn.disabled = this.currentPage === 1;
        this.nextBtn.disabled = this.currentPage === this.totalPages || this.totalPages === 0;
    }
    
    /**
     * Go to previous page
     */
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadData();
        }
    }
    
    /**
     * Go to next page
     */
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.loadData();
        }
    }
    
    /**
     * Open modal for adding new record
     */
    openAddModal() {
        this.currentRecord = null;
        this.modalTitle.textContent = `Add New ${this.entityName}`;
        this.renderForm();
        this.formModal.classList.add('active');
    }
    
    /**
     * Open modal for editing record
     */
    async openEditModal(id) {
        try {
            const response = await fetch(`${this.apiUrl}/${id}`);
            if (!response.ok) throw new Error('Failed to fetch record');
            
            this.currentRecord = await response.json();
            this.modalTitle.textContent = `Edit ${this.entityName}`;
            this.renderForm(this.currentRecord);
            this.formModal.classList.add('active');
            
        } catch (error) {
            console.error('Error fetching record:', error);
            alert('Failed to load record for editing');
        }
    }
    
    /**
     * Render form fields
     */
    renderForm(data = null) {
        let formHtml = '';
        
        this.formFields.forEach(field => {
            const value = data ? (data[field.name] || '') : '';
            
            formHtml += `<div class="form-group">`;
            formHtml += `<label class="form-label" for="${field.name}">${field.label}</label>`;
            
            if (field.type === 'select') {
                formHtml += `<select class="form-select" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>`;
                formHtml += `<option value="">Select ${field.label}</option>`;
                field.options.forEach(option => {
                    const selected = value === option ? 'selected' : '';
                    formHtml += `<option value="${option}" ${selected}>${option}</option>`;
                });
                formHtml += `</select>`;
            } else if (field.type === 'textarea') {
                formHtml += `<textarea class="form-input" id="${field.name}" name="${field.name}" rows="3" ${field.required ? 'required' : ''}>${value}</textarea>`;
            } else {
                formHtml += `<input type="${field.type}" class="form-input" id="${field.name}" name="${field.name}" value="${value}" ${field.required ? 'required' : ''}>`;
            }
            
            formHtml += `</div>`;
        });
        
        this.recordForm.innerHTML = formHtml;
    }
    
    /**
     * Save record (create or update)
     */
    async saveRecord() {
        try {
            const formData = new FormData(this.recordForm);
            const data = Object.fromEntries(formData.entries());
            
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
            
            if (!response.ok) throw new Error('Failed to save record');
            
            this.closeModal();
            this.loadData();
            
        } catch (error) {
            console.error('Error saving record:', error);
            alert('Failed to save record. Please try again.');
        }
    }
    
    /**
     * Open delete confirmation modal
     */
    openDeleteModal(id) {
        this.recordToDelete = id;
        this.deleteModal.classList.add('active');
    }
    
    /**
     * Confirm and delete record
     */
    async confirmDelete() {
        if (!this.recordToDelete) return;
        
        try {
            const response = await fetch(`${this.apiUrl}/${this.recordToDelete}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Failed to delete record');
            
            this.closeDeleteModal();
            this.loadData();
            
        } catch (error) {
            console.error('Error deleting record:', error);
            alert('Failed to delete record. Please try again.');
        }
    }
    
    /**
     * Close form modal
     */
    closeModal() {
        this.formModal.classList.remove('active');
        this.recordForm.reset();
        this.currentRecord = null;
    }
    
    /**
     * Close delete modal
     */
    closeDeleteModal() {
        this.deleteModal.classList.remove('active');
        this.recordToDelete = null;
    }
    
    /**
     * Show loading spinner
     */
    showLoading() {
        this.loadingSpinner.style.display = 'flex';
        this.tableElement.style.display = 'none';
    }
    
    /**
     * Hide loading spinner
     */
    hideLoading() {
        this.loadingSpinner.style.display = 'none';
        this.tableElement.style.display = 'table';
    }
    
    /**
     * Show error message
     */
    showError(message) {
        this.errorMessage.style.display = 'flex';
        document.getElementById('errorText').textContent = message;
        this.tableElement.style.display = 'none';
    }
    
    /**
     * Hide error message
     */
    hideError() {
        this.errorMessage.style.display = 'none';
    }
}
