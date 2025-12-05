from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_current_user, require_role

router = APIRouter(prefix="/grades", tags=["Grades"])


@router.post("", response_model=schemas.GradeResponse)
def add_grade(
    grade_data: schemas.GradeCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin", "teacher"))
):
    # Verify student exists
    student = db.query(models.Student).filter(
        models.Student.id == grade_data.student_id
    ).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )

    # Verify assignment exists
    assignment = db.query(models.Assignment).filter(
        models.Assignment.id == grade_data.assignment_id
    ).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )

    # If teacher, verify they teach this course
    if current_user.role == models.RoleEnum.teacher:
        teacher = db.query(models.Teacher).filter(
            models.Teacher.user_id == current_user.id
        ).first()
        if assignment.course.teacher_id != teacher.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to grade this assignment"
            )

    # Check if grade already exists for this student and assignment
    existing_grade = db.query(models.Grade).filter(
        models.Grade.student_id == grade_data.student_id,
        models.Grade.assignment_id == grade_data.assignment_id
    ).first()
    if existing_grade:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Grade already exists for this student and assignment"
        )

    grade = models.Grade(
        student_id=grade_data.student_id,
        assignment_id=grade_data.assignment_id,
        points_earned=grade_data.points_earned,
        feedback=grade_data.feedback
    )
    db.add(grade)
    db.commit()
    db.refresh(grade)
    return grade


@router.put("/{grade_id}", response_model=schemas.GradeResponse)
def update_grade(
    grade_id: int,
    grade_data: schemas.GradeUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin", "teacher"))
):
    grade = db.query(models.Grade).filter(models.Grade.id == grade_id).first()
    if not grade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grade not found"
        )

    # If teacher, verify they teach this course
    if current_user.role == models.RoleEnum.teacher:
        teacher = db.query(models.Teacher).filter(
            models.Teacher.user_id == current_user.id
        ).first()
        if grade.assignment.course.teacher_id != teacher.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this grade"
            )

    if grade_data.points_earned is not None:
        grade.points_earned = grade_data.points_earned
    if grade_data.feedback is not None:
        grade.feedback = grade_data.feedback

    db.commit()
    db.refresh(grade)
    return grade


@router.delete("/{grade_id}")
def delete_grade(
    grade_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin", "teacher"))
):
    grade = db.query(models.Grade).filter(models.Grade.id == grade_id).first()
    if not grade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grade not found"
        )

    # If teacher, verify they teach this course
    if current_user.role == models.RoleEnum.teacher:
        teacher = db.query(models.Teacher).filter(
            models.Teacher.user_id == current_user.id
        ).first()
        if grade.assignment.course.teacher_id != teacher.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this grade"
            )

    db.delete(grade)
    db.commit()
    return {"message": "Grade deleted successfully"}
