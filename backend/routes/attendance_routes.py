from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from database import get_db
import models
import schemas
from auth import get_current_user, require_role

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post("", response_model=schemas.AttendanceResponse)
def mark_attendance(
    attendance_data: schemas.AttendanceCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin", "teacher"))
):
    # Verify student exists
    student = db.query(models.Student).filter(
        models.Student.id == attendance_data.student_id
    ).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )

    # Verify course exists
    course = db.query(models.Course).filter(
        models.Course.id == attendance_data.course_id
    ).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )

    # If teacher, verify they teach this course
    if current_user.role == models.RoleEnum.teacher:
        teacher = db.query(models.Teacher).filter(
            models.Teacher.user_id == current_user.id
        ).first()
        if course.teacher_id != teacher.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to mark attendance for this course"
            )

    # Check if attendance already exists
    existing_attendance = db.query(models.Attendance).filter(
        models.Attendance.student_id == attendance_data.student_id,
        models.Attendance.course_id == attendance_data.course_id,
        models.Attendance.date == attendance_data.date
    ).first()

    if existing_attendance:
        # Update existing attendance
        existing_attendance.status = attendance_data.status
        existing_attendance.notes = attendance_data.notes
        db.commit()
        db.refresh(existing_attendance)
        return existing_attendance
    else:
        # Create new attendance record
        attendance = models.Attendance(
            student_id=attendance_data.student_id,
            course_id=attendance_data.course_id,
            date=attendance_data.date,
            status=attendance_data.status,
            notes=attendance_data.notes
        )
        db.add(attendance)
        db.commit()
        db.refresh(attendance)
        return attendance


@router.get("", response_model=List[schemas.AttendanceResponse])
def get_attendance_by_date(
    date: date,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    attendance_records = db.query(models.Attendance).filter(
        models.Attendance.date == date
    ).all()
    return attendance_records
