from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
from auth import get_current_user, require_role

router = APIRouter(prefix="/assignments", tags=["Assignments"])


@router.get("", response_model=List[schemas.AssignmentResponse])
def get_all_assignments(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    assignments = db.query(models.Assignment).all()
    return assignments


@router.post("", response_model=schemas.AssignmentResponse)
def create_assignment(
    assignment_data: schemas.AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin", "teacher"))
):
    # Verify course exists
    course = db.query(models.Course).filter(
        models.Course.id == assignment_data.course_id
    ).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )

    # If teacher, verify they own this course
    if current_user.role == models.RoleEnum.teacher:
        teacher = db.query(models.Teacher).filter(
            models.Teacher.user_id == current_user.id
        ).first()
        if course.teacher_id != teacher.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to create assignments for this course"
            )

    assignment = models.Assignment(
        course_id=assignment_data.course_id,
        title=assignment_data.title,
        description=assignment_data.description,
        due_date=assignment_data.due_date,
        max_points=assignment_data.max_points
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment


@router.put("/{assignment_id}", response_model=schemas.AssignmentResponse)
def update_assignment(
    assignment_id: int,
    assignment_data: schemas.AssignmentUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin", "teacher"))
):
    assignment = db.query(models.Assignment).filter(
        models.Assignment.id == assignment_id
    ).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )

    # If teacher, verify they own this course
    if current_user.role == models.RoleEnum.teacher:
        teacher = db.query(models.Teacher).filter(
            models.Teacher.user_id == current_user.id
        ).first()
        if assignment.course.teacher_id != teacher.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this assignment"
            )

    if assignment_data.title is not None:
        assignment.title = assignment_data.title
    if assignment_data.description is not None:
        assignment.description = assignment_data.description
    if assignment_data.due_date is not None:
        assignment.due_date = assignment_data.due_date
    if assignment_data.max_points is not None:
        assignment.max_points = assignment_data.max_points

    db.commit()
    db.refresh(assignment)
    return assignment


@router.delete("/{assignment_id}")
def delete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin", "teacher"))
):
    assignment = db.query(models.Assignment).filter(
        models.Assignment.id == assignment_id
    ).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )

    # If teacher, verify they own this course
    if current_user.role == models.RoleEnum.teacher:
        teacher = db.query(models.Teacher).filter(
            models.Teacher.user_id == current_user.id
        ).first()
        if assignment.course.teacher_id != teacher.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this assignment"
            )

    db.delete(assignment)
    db.commit()
    return {"message": "Assignment deleted successfully"}
