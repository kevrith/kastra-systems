from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
from auth import get_current_user, require_role

router = APIRouter(prefix="/courses", tags=["Courses"])


@router.get("", response_model=List[schemas.CourseResponse])
def get_all_courses(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    courses = db.query(models.Course).all()
    return courses


@router.get("/{course_id}", response_model=schemas.CourseResponse)
def get_course_by_id(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    return course


@router.post("", response_model=schemas.CourseResponse)
def create_course(
    course_data: schemas.CourseCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    # Check if course code already exists
    existing_course = db.query(models.Course).filter(
        models.Course.code == course_data.code
    ).first()
    if existing_course:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Course code already exists"
        )

    # Verify teacher exists
    teacher = db.query(models.Teacher).filter(
        models.Teacher.id == course_data.teacher_id
    ).first()
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher not found"
        )

    course = models.Course(
        name=course_data.name,
        code=course_data.code,
        description=course_data.description,
        teacher_id=course_data.teacher_id,
        credits=course_data.credits
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.put("/{course_id}", response_model=schemas.CourseResponse)
def update_course(
    course_id: int,
    course_data: schemas.CourseUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    if course_data.name is not None:
        course.name = course_data.name
    if course_data.description is not None:
        course.description = course_data.description
    if course_data.teacher_id is not None:
        # Verify teacher exists
        teacher = db.query(models.Teacher).filter(
            models.Teacher.id == course_data.teacher_id
        ).first()
        if not teacher:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Teacher not found"
            )
        course.teacher_id = course_data.teacher_id
    if course_data.credits is not None:
        course.credits = course_data.credits

    db.commit()
    db.refresh(course)
    return course


@router.delete("/{course_id}")
def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    db.delete(course)
    db.commit()
    return {"message": "Course deleted successfully"}


@router.get("/{course_id}/assignments", response_model=List[schemas.AssignmentResponse])
def get_course_assignments(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    assignments = db.query(models.Assignment).filter(
        models.Assignment.course_id == course_id
    ).all()
    return assignments
