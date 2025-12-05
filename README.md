# Kastra Systems - Setup Guide

A complete school management system with React frontend and FastAPI backend.

## Project Structure

```
kastra-systems/
├── frontend/kastra-systems-app/  # React + Vite frontend
└── backend/                       # FastAPI backend
```

## Backend Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Quick Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Run the setup script** (Recommended)
   ```bash
   ./setup.sh
   ```

   Or manually:

   ```bash
   # Create virtual environment
   python3 -m venv venv

   # Activate virtual environment
   source venv/bin/activate  # On Windows: venv\Scripts\activate

   # Install dependencies
   pip install -r requirements.txt

   # Create .env file
   cp .env.example .env

   # Initialize database
   python init_db.py
   ```

3. **Start the backend server**
   ```bash
   source venv/bin/activate  # If not already activated
   python main.py
   ```

   Or:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Access the API**
   - API Base URL: http://localhost:8000
   - Swagger Docs: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Default Login Credentials

After running `init_db.py`, use these credentials:

- **Admin**:
  - Email: admin@kastra.com
  - Password: admin123

- **Teacher**:
  - Email: teacher@kastra.com
  - Password: teacher123

- **Student**:
  - Email: student@kastra.com
  - Password: student123

## Frontend Setup

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Quick Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend/kastra-systems-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API URL** (Optional)

   The frontend is configured to connect to `http://localhost:8000/api` by default.
   To change this, update the `API_URL` in [src/services/api.js](frontend/kastra-systems-app/src/services/api.js):

   ```javascript
   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173

## Running Both Frontend and Backend

1. **Terminal 1 - Backend**
   ```bash
   cd backend
   source venv/bin/activate
   python main.py
   ```

2. **Terminal 2 - Frontend**
   ```bash
   cd frontend/kastra-systems-app
   npm run dev
   ```

3. **Access**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Features

### User Roles
- **Admin**: Full system access, manage all users, courses, and settings
- **Teacher**: Manage courses, assignments, grades, and attendance
- **Student**: View courses, assignments, grades, and attendance

### Core Modules
- **Dashboard**: Overview statistics and recent activities
- **Students Management**: CRUD operations for students
- **Teachers Management**: CRUD operations for teachers
- **Courses Management**: Course creation and management
- **Enrollments**: Enroll students in courses
- **Assignments**: Create and manage assignments
- **Grades**: Grade submissions and view student performance
- **Attendance**: Mark and track student attendance
- **Announcements**: Post announcements to target audiences

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create student (Admin only)
- `GET /api/students/{id}` - Get student details
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student
- `GET /api/students/{id}/courses` - Get student's courses
- `GET /api/students/{id}/grades` - Get student's grades
- `GET /api/students/{id}/attendance` - Get student's attendance

### Teachers
- `GET /api/teachers` - Get all teachers
- `POST /api/teachers` - Create teacher (Admin only)
- `PUT /api/teachers/{id}` - Update teacher
- `DELETE /api/teachers/{id}` - Delete teacher

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (Admin only)
- `GET /api/courses/{id}` - Get course details
- `PUT /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Delete course
- `GET /api/courses/{id}/assignments` - Get course assignments

### Enrollments
- `POST /api/enrollments` - Enroll student in course
- `DELETE /api/enrollments/{id}` - Unenroll student

### Assignments
- `GET /api/assignments` - Get all assignments
- `POST /api/assignments` - Create assignment
- `PUT /api/assignments/{id}` - Update assignment
- `DELETE /api/assignments/{id}` - Delete assignment

### Grades
- `POST /api/grades` - Add grade
- `PUT /api/grades/{id}` - Update grade
- `DELETE /api/grades/{id}` - Delete grade

### Attendance
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance?date=YYYY-MM-DD` - Get attendance by date

### Announcements
- `GET /api/announcements` - Get all announcements
- `POST /api/announcements` - Create announcement
- `DELETE /api/announcements/{id}` - Delete announcement

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **Pydantic** - Data validation
- **JWT** - Authentication
- **SQLite** - Database (easily switchable to PostgreSQL/MySQL)
- **Bcrypt** - Password hashing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **React Router** - Navigation

## Security Notes

- JWT tokens expire after 24 hours (configurable in `.env`)
- Passwords are hashed using bcrypt
- Role-based access control (RBAC) for all endpoints
- CORS configured for development (update for production)

## Database Management

### Reset Database to Original State

**Warning:** This will DELETE all data!

```bash
cd backend

# Method 1: Delete and reinitialize
rm kastra_systems.db
python init_db.py

# Method 2: Use reset script (if you create one)
python reset_db.py
```

### Backup Database

```bash
# SQLite backup
cp backend/kastra_systems.db backend/backups/kastra_systems_$(date +%Y%m%d).db

# Or use SQLite command
sqlite3 backend/kastra_systems.db ".backup 'backup.db'"
```

### Restore Database from Backup

```bash
# Simply copy the backup file
cp backend/backups/kastra_systems_20241203.db backend/kastra_systems.db

# Restart the backend server
```

### Clear Logs (Safe Operation)

The log files can be safely deleted or cleared:

```bash
# Clear logs
> backend.log
> frontend.log

# Or delete them
rm backend.log frontend.log
```

**Note:** Logs will be automatically recreated when you restart the servers.

### Database Migration (Adding New Fields)

**IMPORTANT:** Don't run `init_db.py` after you have real data!

For schema changes with existing data:
1. Use Alembic for migrations (recommended for production)
2. Or manually add columns using SQLite commands:

```sql
-- Example: Add new column to students table
sqlite3 kastra_systems.db "ALTER TABLE students ADD COLUMN new_field VARCHAR(100);"
```

## Troubleshooting

### Backend Issues

1. **Import errors**: Make sure virtual environment is activated
   ```bash
   source venv/bin/activate
   ```

2. **Database errors**: Reinitialize the database (WARNING: Deletes all data!)
   ```bash
   rm kastra_systems.db  # Delete existing database
   python init_db.py     # Reinitialize with sample data
   ```

3. **Port already in use**: Change the port in main.py or kill the process
   ```bash
   lsof -ti:8000 | xargs kill -9  # Kill process on port 8000
   ```

### Frontend Issues

1. **Cannot connect to API**: Ensure backend is running on port 8000

2. **Module not found**: Reinstall dependencies
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Port already in use**: Vite will automatically suggest another port

## Production Deployment

### Backend
1. Change `SECRET_KEY` in `.env` to a secure random string
2. Use PostgreSQL or MySQL instead of SQLite
3. Update CORS origins in [main.py](backend/main.py)
4. Use Gunicorn with Uvicorn workers
5. Set up SSL/HTTPS
6. Configure proper environment variables

### Frontend
1. Build the production bundle
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your hosting service
3. Update `API_URL` to point to production backend


## Areas for Improvement

The following features and enhancements are recommended for future development:

### High Priority

1. **Office Management Capability**
   - Document management system for school records
   - Staff attendance and leave management
   - Inventory tracking (books, equipment, supplies)
   - Meeting scheduler and room booking system
   - Internal messaging and communication system
   - Digital notice board for staff and students
   - Asset management and maintenance tracking

2. **Enhanced PDF Generation**
   - Replace browser print dialog with proper PDF library (html2pdf.js or jsPDF)
   - Batch PDF generation for multiple students
   - Custom PDF templates for different document types
   - Digital signatures for official documents
   - Watermarking and document security

3. **Advanced Reporting & Analytics**
   - Interactive dashboards with real-time data
   - Trend analysis and predictive insights
   - Custom report builder for administrators
   - Export reports in multiple formats (PDF, Excel, CSV)
   - Comparative analysis across terms/years
   - Student performance prediction using ML

### Medium Priority

4. **Mobile Application**
   - Native iOS and Android apps
   - Push notifications for important updates
   - Offline mode for viewing data
   - Mobile-optimized interfaces
   - Parent mobile app for tracking student progress

5. **Communication & Collaboration**
   - Email integration for automated notifications
   - SMS alerts for parents and students
   - Built-in messaging system (like Slack)
   - Video conferencing integration (Zoom/Teams)
   - Discussion forums for classes
   - Parent-teacher chat functionality

6. **Financial Management**
   - Online payment gateway integration (Stripe, PayPal, M-Pesa)
   - Automated fee reminders and receipts
   - Financial reports and forecasting
   - Budget planning and tracking
   - Expense management for school operations
   - Payroll integration for staff salaries

7. **Academic Enhancements**
   - Online examination system
   - Assignment submission portal
   - Plagiarism checker integration
   - Grade curve and normalization tools
   - Learning management system (LMS) features
   - Digital library with e-books

### Low Priority

8. **User Experience Improvements**
   - Dark mode support
   - Customizable dashboard layouts
   - Keyboard shortcuts for power users
   - Multi-language support (i18n)
   - Accessibility improvements (WCAG compliance)
   - Progressive Web App (PWA) capabilities

9. **Security Enhancements**
   - Two-factor authentication (2FA)
   - Single Sign-On (SSO) integration
   - Audit logs for all critical actions
   - Role-based fine-grained permissions
   - Data encryption at rest and in transit
   - Regular security audits and penetration testing

10. **Integration Capabilities**
    - API for third-party integrations
    - Webhook support for external systems
    - Google Classroom integration
    - Microsoft 365 integration
    - Learning analytics platforms (Canvas, Moodle)
    - Government education portals

11. **Performance Optimization**
    - Database query optimization
    - Caching layer (Redis)
    - CDN integration for static assets
    - Image optimization and lazy loading
    - Code splitting and lazy loading components
    - Server-side rendering (SSR) for critical pages

12. **Administrative Tools**
    - Backup and restore automation
    - Database migration tools
    - System health monitoring dashboard
    - User activity analytics
    - Automated testing suite
    - CI/CD pipeline setup

### Future Innovations

13. **AI-Powered Features**
    - Automated grading assistance
    - Personalized learning recommendations
    - Chatbot for common queries
    - Attendance prediction and intervention alerts
    - Resource allocation optimization
    - Smart timetable generation

14. **Advanced Analytics**
    - Machine learning for dropout prediction
    - Student success pattern identification
    - Teacher performance analytics
    - Resource utilization optimization
    - Predictive enrollment modeling

## Implementation Timeline

- **Phase 1 (1-3 months):** Office management, enhanced PDF generation, basic reporting
- **Phase 2 (3-6 months):** Mobile app, payment integration, communication tools
- **Phase 3 (6-12 months):** Advanced analytics, LMS features, third-party integrations
- **Phase 4 (12+ months):** AI features, predictive analytics, advanced automation

## Contributing

Contributions are welcome! If you'd like to implement any of these improvements, please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request with detailed description

## License

MIT License
