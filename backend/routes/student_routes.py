from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
from auth import get_current_user, require_role, get_password_hash

router = APIRouter(prefix="/students", tags=["Students"])


@router.get("", response_model=List[schemas.StudentResponse])
def get_all_students(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    students = db.query(models.Student).all()
    return students


@router.get("/{student_id}", response_model=schemas.StudentResponse)
def get_student_by_id(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    return student


@router.post("", response_model=schemas.StudentResponse)
def create_student(
    student_data: schemas.StudentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    # Check if email already exists
    existing_user = db.query(models.User).filter(models.User.email == student_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create user
    user = models.User(
        email=student_data.email,
        password_hash=get_password_hash(student_data.password),
        first_name=student_data.first_name,
        last_name=student_data.last_name,
        role=models.RoleEnum.student
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create student
    student = models.Student(
        user_id=user.id,
        phone=student_data.phone,
        date_of_birth=student_data.date_of_birth,
        address=student_data.address
    )
    db.add(student)
    db.commit()
    db.refresh(student)

    return student


@router.put("/{student_id}", response_model=schemas.StudentResponse)
def update_student(
    student_id: int,
    student_data: schemas.StudentUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin", "student"))
):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    # Check permissions
    if current_user.role == models.RoleEnum.student and student.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    # Update student fields
    if student_data.phone is not None:
        student.phone = student_data.phone
    if student_data.date_of_birth is not None:
        student.date_of_birth = student_data.date_of_birth
    if student_data.address is not None:
        student.address = student_data.address

    # Update user fields
    if student_data.first_name is not None:
        student.user.first_name = student_data.first_name
    if student_data.last_name is not None:
        student.user.last_name = student_data.last_name

    db.commit()
    db.refresh(student)
    return student


@router.delete("/{student_id}")
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    # Delete student and associated user
    user = student.user
    db.delete(student)
    db.delete(user)
    db.commit()

    return {"message": "Student deleted successfully"}


@router.get("/{student_id}/courses", response_model=List[schemas.CourseResponse])
def get_student_courses(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    enrollments = db.query(models.Enrollment).filter(
        models.Enrollment.student_id == student_id
    ).all()

    courses = [enrollment.course for enrollment in enrollments]
    return courses


@router.get("/{student_id}/grades")
def get_student_grades(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    grades = db.query(models.Grade).filter(models.Grade.student_id == student_id).all()

    result = []
    for grade in grades:
        result.append({
            "id": grade.id,
            "assignment_id": grade.assignment_id,
            "assignment_title": grade.assignment.title,
            "course_name": grade.assignment.course.name,
            "points_earned": grade.points_earned,
            "max_points": grade.assignment.max_points,
            "feedback": grade.feedback,
            "graded_at": grade.graded_at
        })

    return result


@router.get("/{student_id}/attendance")
def get_student_attendance(
    student_id: int,
    course_id: int = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    query = db.query(models.Attendance).filter(models.Attendance.student_id == student_id)

    if course_id:
        query = query.filter(models.Attendance.course_id == course_id)

    attendance_records = query.all()

    result = []
    for record in attendance_records:
        result.append({
            "id": record.id,
            "course_id": record.course_id,
            "course_name": record.course.name,
            "date": record.date,
            "status": record.status,
            "notes": record.notes
        })

    return result
