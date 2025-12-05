from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_current_user, require_role

router = APIRouter(prefix="/enrollments", tags=["Enrollments"])


@router.post("", response_model=schemas.EnrollmentResponse)
def enroll_student(
    enrollment_data: schemas.EnrollmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin", "teacher"))
):
    # Verify student exists
    student = db.query(models.Student).filter(
        models.Student.id == enrollment_data.student_id
    ).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )

    # Verify course exists
    course = db.query(models.Course).filter(
        models.Course.id == enrollment_data.course_id
    ).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )

    # Check if already enrolled
    existing_enrollment = db.query(models.Enrollment).filter(
        models.Enrollment.student_id == enrollment_data.student_id,
        models.Enrollment.course_id == enrollment_data.course_id
    ).first()
    if existing_enrollment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student already enrolled in this course"
        )

    enrollment = models.Enrollment(
        student_id=enrollment_data.student_id,
        course_id=enrollment_data.course_id
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment


@router.delete("/{enrollment_id}")
def unenroll_student(
    enrollment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin", "teacher"))
):
    enrollment = db.query(models.Enrollment).filter(
        models.Enrollment.id == enrollment_id
    ).first()
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enrollment not found"
        )

    db.delete(enrollment)
    db.commit()
    return {"message": "Student unenrolled successfully"}
