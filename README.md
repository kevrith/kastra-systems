# Kastra Systems

A modern school management system built with React and FastAPI.

## Tech Stack

**Backend:** FastAPI, SQLAlchemy, JWT, SQLite
**Frontend:** React, Vite, TailwindCSS

## Quick Start

### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python init_db.py  # Production: Creates empty database
python main.py
```

**Optional - Development with demo accounts:**
```bash
python init_db_with_demo.py  # Creates test accounts (admin/teacher/student)
```

### Frontend Setup
```bash
cd frontend/kastra-systems-app
npm install
npm run dev
```

### Access
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

Register your first admin account at http://localhost:5173

## Features

- **User Management:** Role-based access for Admin, Teacher, and Student
- **Academic Management:** Courses, assignments, grades, and enrollments
- **Attendance Tracking:** Mark and monitor student attendance
- **Announcements:** Broadcast messages to targeted audiences
- **Dashboard:** Overview statistics and analytics
- **Fee Management:** Track student fees and payment records
- **Report Cards:** Generate and manage student report cards

## Production Deployment

### Environment Configuration

**Local Development:**
```bash
# Edit frontend/kastra-systems-app/.env.local
VITE_API_URL=http://localhost:8000/api
```

**Production:**
- Backend: https://kastra-systems.onrender.com
- Frontend: https://kastra-systems.vercel.app

### Backend (Render)

**Build Command:** `pip install -r requirements.txt`
**Start Command:** `python main.py`

Update CORS in [backend/main.py](backend/main.py):
```python
allow_origins=[
    "http://localhost:5173",
    "https://kastra-systems.vercel.app"
]
```

### Frontend (Vercel)

The project is configured for automatic deployment on Vercel.

**Manual setup:**
1. Vercel dashboard → Project settings → Environment Variables
2. Add `VITE_API_URL` = `https://kastra-systems.onrender.com/api`
3. Deploy

### Deployment Checklist
- [ ] Backend CORS includes production URL
- [ ] Backend health check passes: https://kastra-systems.onrender.com/health
- [ ] Frontend environment variables configured
- [ ] Test production login and features

## API Endpoints

**Authentication**
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login with JWT

**Resources**
- `/api/students` - Student management
- `/api/teachers` - Teacher management
- `/api/courses` - Course management
- `/api/assignments` - Assignment management
- `/api/grades` - Grade management
- `/api/attendance` - Attendance tracking
- `/api/announcements` - Announcements
- `/api/dashboard/stats` - Dashboard statistics
- `/api/fees` - Fee management
- `/api/report-cards` - Report card management

Full API documentation: http://localhost:8000/docs

## Database Management

**Reset Database** (Warning: Deletes all data)
```bash
cd backend
rm kastra_systems.db
python init_db.py
```

**Backup Database**
```bash
cp backend/kastra_systems.db backend/backups/backup_$(date +%Y%m%d).db
```

## Troubleshooting

**Backend Issues:**
- Port in use: `lsof -ti:8000 | xargs kill -9`
- Import errors: Ensure virtual environment is activated

**Frontend Issues:**
- API connection: Verify backend is running on port 8000
- Environment changes: Restart dev server after editing `.env.local`

**Production Issues:**
- CORS errors: Check backend CORS configuration
- Build fails: Review Vercel deployment logs
- API errors: Check Render service logs
- 422 Errors: Ensure frontend and backend schemas match (check deployed versions)

## Security

- JWT tokens with 24-hour expiration
- Bcrypt password hashing
- Role-based access control (RBAC)
- CORS protection

## License

MIT License
