from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import (
    auth_routes,
    student_routes,
    teacher_routes,
    course_routes,
    enrollment_routes,
    assignment_routes,
    grade_routes,
    attendance_routes,
    announcement_routes,
    dashboard_routes,
    report_card_routes,
    fee_routes
)

app = FastAPI(
    title="Kastra Systems API",
    description="School Management System API",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Local Vite dev server
        "http://localhost:5174",  # Alternative local port
        "http://localhost:3000",  # Alternative local port
        "https://kastra.netlify.app",  # Production frontend
        "https://precious-selkie-c861a9.netlify.app"  # Alternative Netlify domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers with /api prefix
app.include_router(auth_routes.router, prefix="/api")
app.include_router(student_routes.router, prefix="/api")
app.include_router(teacher_routes.router, prefix="/api")
app.include_router(course_routes.router, prefix="/api")
app.include_router(enrollment_routes.router, prefix="/api")
app.include_router(assignment_routes.router, prefix="/api")
app.include_router(grade_routes.router, prefix="/api")
app.include_router(attendance_routes.router, prefix="/api")
app.include_router(announcement_routes.router, prefix="/api")
app.include_router(dashboard_routes.router, prefix="/api")
app.include_router(report_card_routes.router, prefix="/api")
app.include_router(fee_routes.router, prefix="/api")


@app.get("/")
def root():
    return {
        "message": "Welcome to Kastra Systems API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    from database import SessionLocal
    from sqlalchemy import text

    health_status = {
        "api": {
            "status": "online",
            "message": "API is running"
        },
        "database": {
            "status": "offline",
            "message": "Database connection failed"
        }
    }

    # Test database connection
    try:
        db = SessionLocal()
        # Try to execute a simple query
        db.execute(text("SELECT 1"))
        db.close()

        health_status["database"] = {
            "status": "online",
            "message": "Database is healthy"
        }
    except Exception as e:
        health_status["database"] = {
            "status": "offline",
            "message": f"Database error: {str(e)}"
        }

    # Determine overall status
    overall_healthy = all(
        component["status"] == "online"
        for component in health_status.values()
    )

    return {
        "status": "healthy" if overall_healthy else "unhealthy",
        "components": health_status
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
