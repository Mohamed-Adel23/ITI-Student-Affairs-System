# 🎓 Students Affairs System

A modern, clean, and functional web application for managing student affairs data built with **HTML5**, **CSS3**, and **JavaScript ES6** using OOP principles and modules.

## ✨ Features

- 📊 **Complete CRUD Operations** - Create, Read, Update, Delete
- 🔍 **Search Functionality** - Quick search across all records
- 📑 **Pagination** - Navigate through records efficiently
- 🔄 **Sorting** - Sort by any column (ascending/descending)
- 🎨 **Modern UI/UX** - Clean, beautiful, and responsive design
- 📱 **Fully Responsive** - Works on all devices
- ⚡ **Fast & Lightweight** - No heavy frameworks, pure JavaScript

## 🗂️ Managed Entities

1. **Students** - Student records with personal and academic info
2. **Courses** - Course catalog with details
3. **Instructors** - Faculty and instructor information
4. **Employees** - Staff and employee records

## 🚀 Quick Start

### Prerequisites

- Node.js installed (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Install json-server globally**
   ```bash
   npm install -g json-server
   ```

2. **Navigate to the project directory**
   ```bash
   cd students-affairs-system
   ```

3. **Start the json-server backend**
   ```bash
   json-server --watch data/db.json --port 3000
   ```

4. **Open the application**
   - Open `index.html` in your browser
   - Or use a live server extension in VS Code
   - Or use Python: `python -m http.server 8000`

5. **Access the application**
   - Frontend: `http://localhost:8000` (or just open index.html)
   - API: `http://localhost:3000`

## 📁 Project Structure

```
students-affairs-system/
│
├── index.html              # Main HTML file
├── css/
│   └── style.css          # All styles (modern design)
│
├── js/
│   ├── app.js             # Main application entry point
│   └── modules/
│       ├── Student.js     # Student class & CRUD
│       ├── Course.js      # Course class & CRUD
│       ├── Instructor.js  # Instructor class & CRUD
│       ├── Employee.js    # Employee class & CRUD
│       └── DataTable.js   # Reusable DataTable component
│
├── data/
│   └── db.json            # JSON database for json-server
│
└── README.md              # This file
```

## 🎯 How It Works

### Architecture
- **ES6 Modules** - Code is organized in separate modules
- **OOP Classes** - Each entity has its own class
- **Fetch API** - All HTTP requests use modern Fetch API
- **json-server** - Mock REST API backend

### API Endpoints

The json-server automatically creates RESTful endpoints:

- `GET /students` - Get all students
- `GET /students/:id` - Get student by ID
- `POST /students` - Create new student
- `PUT /students/:id` - Update student
- `DELETE /students/:id` - Delete student

Same pattern for `/courses`, `/instructors`, and `/employees`

### Query Parameters (json-server features)

- **Pagination**: `?_page=1&_limit=10`
- **Sorting**: `?_sort=name&_order=asc`
- **Search**: `?q=keyword`
- **Filter**: `?department=Computer Science`

## 🎨 Design Features

- **Typography**: Modern fonts (Syne + DM Mono)
- **Color Scheme**: Bold orange primary with dark secondary
- **Animations**: Smooth transitions and micro-interactions
- **Components**: Reusable modals, buttons, and tables
- **Responsive**: Mobile-first design approach

## 📝 Usage Guide

### Viewing Records
1. Click on any navigation tab (Students, Courses, etc.)
2. Records will load automatically in a table

### Adding Records
1. Click "Add New" button
2. Fill in the form
3. Click "Save"

### Editing Records
1. Click "Edit" button on any row
2. Modify the fields
3. Click "Save"

### Deleting Records
1. Click "Delete" button on any row
2. Confirm the deletion
3. Record is removed

### Searching
1. Type in the search box
2. Results filter in real-time

### Sorting
1. Click on any column header
2. Click again to reverse order

### Pagination
1. Use "Previous" and "Next" buttons
2. Change items per page from dropdown

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables
- **JavaScript ES6** - Classes, modules, arrow functions
- **Fetch API** - HTTP requests
- **json-server** - Mock REST API

## 🎓 Educational Concepts Demonstrated

- ✅ ES6 Classes and OOP
- ✅ ES6 Modules (import/export)
- ✅ Async/Await with Fetch API
- ✅ DOM Manipulation
- ✅ Event Handling
- ✅ Form Validation
- ✅ Error Handling
- ✅ RESTful API Integration
- ✅ Pagination Logic
- ✅ Search/Filter Algorithms
- ✅ Sorting Algorithms

## 🔧 Customization

### Change API Port
Edit the base URL in each module file:
```javascript
const API_URL = 'http://localhost:3000/students';
```

### Modify Items Per Page
Change the default in index.html:
```html
<option value="10" selected>10 per page</option>
```

### Add New Fields
1. Update the form in the respective module
2. Add the field to db.json structure
3. Update the table headers

## 🐛 Troubleshooting

**Issue**: Can't connect to API
- **Solution**: Make sure json-server is running on port 3000

**Issue**: Changes don't save
- **Solution**: Check browser console for errors
- **Solution**: Verify json-server has write permissions

**Issue**: Styles not loading
- **Solution**: Check file paths are correct
- **Solution**: Clear browser cache

## 📄 License

This is an educational project created for learning purposes.

## 👨‍💻 Development Notes

- Code is intentionally kept simple and readable
- Each module is independent and reusable
- Comments are included for learning purposes
- Error handling shows user-friendly messages

## 😈 Made By Software Geeks

- **Mohamed Adel Elsayed** [![GitHub](https://img.shields.io/badge/GitHub-Profile-blue?logo=github)](https://github.com/Mohamed-Adel23)
- **Mohamed Fahmy** [![GitHub](https://img.shields.io/badge/GitHub-Profile-blue?logo=github)]([https://github.com/YourUsername](https://github.com/Moh7amedFahmy))

