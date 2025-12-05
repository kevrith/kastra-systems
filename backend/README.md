# Kastra Systems Backend

A FastAPI-based backend for the Kastra Systems School Management Application.

## Features

- JWT-based authentication
- Role-based access control (Admin, Teacher, Student)
- Complete REST API for school management
- SQLite database with SQLAlchemy ORM
- Automatic API documentation with Swagger UI

## Tech Stack

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **Pydantic** - Data validation
- **JWT** - JSON Web Tokens for authentication
- **SQLite** - Database (easily switchable to PostgreSQL/MySQL)

## Setup Instructions

### 1. Create and activate virtual environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Create .env file

```bash
cp .env.example .env
```

Edit `.env` and set your own SECRET_KEY for production.

### 4. Initialize database and seed data

```bash
python init_db.py
```

This will create the database tables and seed initial data with default users.

### 5. Run the server

```bash
python main.py
```

Or with uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000

## Default Login Credentials

After running `init_db.py`, you can login with these credentials:

- **Admin**: admin@kastra.com / admin123
- **Teacher**: teacher@kastra.com / teacher123
- **Student**: student@kastra.com / student123

## API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Students
- `GET /api/students` - Get all students
- `GET /api/students/{id}` - Get student by ID
- `POST /api/students` - Create student (Admin only)
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student (Admin only)
- `GET /api/students/{id}/courses` - Get student's courses
- `GET /api/students/{id}/grades` - Get student's grades
- `GET /api/students/{id}/attendance` - Get student's attendance

### Teachers
- `GET /api/teachers` - Get all teachers
- `POST /api/teachers` - Create teacher (Admin only)
- `PUT /api/teachers/{id}` - Update teacher (Admin only)
- `DELETE /api/teachers/{id}` - Delete teacher (Admin only)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/{id}` - Get course by ID
- `POST /api/courses` - Create course (Admin only)
- `PUT /api/courses/{id}` - Update course (Admin only)
- `DELETE /api/courses/{id}` - Delete course (Admin only)
- `GET /api/courses/{id}/assignments` - Get course assignments

### Enrollments
- `POST /api/enrollments` - Enroll student in course (Admin/Teacher)
- `DELETE /api/enrollments/{id}` - Unenroll student (Admin/Teacher)

### Assignments
- `GET /api/assignments` - Get all assignments
- `POST /api/assignments` - Create assignment (Admin/Teacher)
- `PUT /api/assignments/{id}` - Update assignment (Admin/Teacher)
- `DELETE /api/assignments/{id}` - Delete assignment (Admin/Teacher)

### Grades
- `POST /api/grades` - Add grade (Admin/Teacher)
- `PUT /api/grades/{id}` - Update grade (Admin/Teacher)
- `DELETE /api/grades/{id}` - Delete grade (Admin/Teacher)

### Attendance
- `POST /api/attendance` - Mark attendance (Admin/Teacher)
- `GET /api/attendance?date=YYYY-MM-DD` - Get attendance by date

### Announcements
- `GET /api/announcements` - Get all announcements
- `POST /api/announcements` - Create announcement (Admin/Teacher)
- `DELETE /api/announcements/{id}` - Delete announcement (Admin/Teacher/Owner)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Project Structure

```
backend/
├── routes/              # API route handlers
│   ├── auth_routes.py
│   ├── student_routes.py
│   ├── teacher_routes.py
│   ├── course_routes.py
│   ├── enrollment_routes.py
│   ├── assignment_routes.py
│   ├── grade_routes.py
│   ├── attendance_routes.py
│   ├── announcement_routes.py
│   └── dashboard_routes.py
├── models.py           # Database models
├── schemas.py          # Pydantic schemas
├── database.py         # Database configuration
├── auth.py            # Authentication utilities
├── config.py          # Application configuration
├── init_db.py         # Database initialization script
├── main.py            # Application entry point
└── requirements.txt   # Python dependencies
```

## Development

To run in development mode with auto-reload:

```bash
uvicorn main:app --reload
```

## Production Deployment

For production:

1. Change SECRET_KEY in .env to a secure random string
2. Use a production database (PostgreSQL/MySQL)
3. Set up proper CORS origins
4. Use a production ASGI server like Gunicorn with Uvicorn workers
5. Set up SSL/HTTPS
6. Configure environment variables properly

Example production command:
```bash
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Security Notes

- JWT tokens expire after 24 hours (configurable)
- Passwords are hashed using bcrypt
- Role-based access control protects sensitive endpoints
- CORS is configured for development (update for production)

## License

MIT License
