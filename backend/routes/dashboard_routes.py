from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    total_students = db.query(models.Student).count()
    total_teachers = db.query(models.Teacher).count()
    total_courses = db.query(models.Course).count()
    total_enrollments = db.query(models.Enrollment).count()

    return {
        "total_students": total_students,
        "total_teachers": total_teachers,
        "total_courses": total_courses,
        "total_enrollments": total_enrollments
    }
