from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
from auth import get_current_user, require_role, get_password_hash

router = APIRouter(prefix="/teachers", tags=["Teachers"])


@router.get("", response_model=List[schemas.TeacherResponse])
def get_all_teachers(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    teachers = db.query(models.Teacher).all()
    return teachers


@router.post("", response_model=schemas.TeacherResponse)
def create_teacher(
    teacher_data: schemas.TeacherCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    # Check if email already exists
    existing_user = db.query(models.User).filter(models.User.email == teacher_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create user
    user = models.User(
        email=teacher_data.email,
        password_hash=get_password_hash(teacher_data.password),
        first_name=teacher_data.first_name,
        last_name=teacher_data.last_name,
        role=models.RoleEnum.teacher
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create teacher
    teacher = models.Teacher(
        user_id=user.id,
        phone=teacher_data.phone,
        department=teacher_data.department
    )
    db.add(teacher)
    db.commit()
    db.refresh(teacher)

    return teacher


@router.put("/{teacher_id}", response_model=schemas.TeacherResponse)
def update_teacher(
    teacher_id: int,
    teacher_data: schemas.TeacherBase,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    teacher = db.query(models.Teacher).filter(models.Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Teacher not found")

    if teacher_data.phone is not None:
        teacher.phone = teacher_data.phone
    if teacher_data.department is not None:
        teacher.department = teacher_data.department

    db.commit()
    db.refresh(teacher)
    return teacher


@router.delete("/{teacher_id}")
def delete_teacher(
    teacher_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    teacher = db.query(models.Teacher).filter(models.Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Teacher not found")

    # Delete teacher and associated user
    user = teacher.user
    db.delete(teacher)
    db.delete(user)
    db.commit()

    return {"message": "Teacher deleted successfully"}
