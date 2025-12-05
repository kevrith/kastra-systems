from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from database import get_db
import models
import schemas
from auth import get_current_user, require_role

router = APIRouter(prefix="/report-cards", tags=["Report Cards"])


@router.get("", response_model=List[schemas.ReportCardResponse])
def get_all_report_cards(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin", "teacher"))
):
    """Get all report cards"""
    report_cards = db.query(models.ReportCard).all()
    return report_cards


@router.get("/student/{student_id}", response_model=List[schemas.ReportCardResponse])
def get_student_report_cards(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get all report cards for a specific student"""
    # Verify student exists
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )

    # Students can only view their own report cards
    if current_user.role == models.RoleEnum.student:
        user_student = db.query(models.Student).filter(
            models.Student.user_id == current_user.id
        ).first()
        if user_student.id != student_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this student's report cards"
            )

    report_cards = db.query(models.ReportCard).filter(
        models.ReportCard.student_id == student_id
    ).order_by(models.ReportCard.generated_at.desc()).all()

    return report_cards


@router.get("/{report_card_id}", response_model=schemas.ReportCardResponse)
def get_report_card(
    report_card_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get a specific report card by ID"""
    report_card = db.query(models.ReportCard).filter(
        models.ReportCard.id == report_card_id
    ).first()

    if not report_card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report card not found"
        )

    # Students can only view their own report cards
    if current_user.role == models.RoleEnum.student:
        user_student = db.query(models.Student).filter(
            models.Student.user_id == current_user.id
        ).first()
        if report_card.student_id != user_student.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this report card"
            )

    return report_card


@router.post("", response_model=schemas.ReportCardResponse)
def create_report_card(
    report_card_data: schemas.ReportCardCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin", "teacher"))
):
    """Create a new report card"""
    # Verify student exists
    student = db.query(models.Student).filter(
        models.Student.id == report_card_data.student_id
    ).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )

    # Check if report card already exists for this student, year, and term
    existing = db.query(models.ReportCard).filter(
        models.ReportCard.student_id == report_card_data.student_id,
        models.ReportCard.academic_year == report_card_data.academic_year,
        models.ReportCard.term == report_card_data.term
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Report card already exists for this student, academic year, and term"
        )

    # Create report card
    report_card = models.ReportCard(
        student_id=report_card_data.student_id,
        academic_year=report_card_data.academic_year,
        term=report_card_data.term,
        gpa=report_card_data.gpa,
        class_rank=report_card_data.class_rank,
        total_students=report_card_data.total_students,
        attendance_percentage=report_card_data.attendance_percentage,
        conduct_grade=report_card_data.conduct_grade,
        teacher_remarks=report_card_data.teacher_remarks,
        principal_remarks=report_card_data.principal_remarks
    )

    db.add(report_card)
    db.flush()  # Get the report_card.id

    # Add skill assessments
    for skill_data in report_card_data.skill_assessments:
        skill = models.SkillAssessment(
            report_card_id=report_card.id,
            skill_name=skill_data.skill_name,
            score=skill_data.score
        )
        db.add(skill)

    db.commit()
    db.refresh(report_card)
    return report_card


@router.put("/{report_card_id}", response_model=schemas.ReportCardResponse)
def update_report_card(
    report_card_id: int,
    report_card_data: schemas.ReportCardUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin", "teacher"))
):
    """Update an existing report card"""
    report_card = db.query(models.ReportCard).filter(
        models.ReportCard.id == report_card_id
    ).first()

    if not report_card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report card not found"
        )

    # Update fields
    if report_card_data.gpa is not None:
        report_card.gpa = report_card_data.gpa
    if report_card_data.class_rank is not None:
        report_card.class_rank = report_card_data.class_rank
    if report_card_data.total_students is not None:
        report_card.total_students = report_card_data.total_students
    if report_card_data.attendance_percentage is not None:
        report_card.attendance_percentage = report_card_data.attendance_percentage
    if report_card_data.conduct_grade is not None:
        report_card.conduct_grade = report_card_data.conduct_grade
    if report_card_data.teacher_remarks is not None:
        report_card.teacher_remarks = report_card_data.teacher_remarks
    if report_card_data.principal_remarks is not None:
        report_card.principal_remarks = report_card_data.principal_remarks

    db.commit()
    db.refresh(report_card)
    return report_card


@router.delete("/{report_card_id}")
def delete_report_card(
    report_card_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    """Delete a report card (admin only)"""
    report_card = db.query(models.ReportCard).filter(
        models.ReportCard.id == report_card_id
    ).first()

    if not report_card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report card not found"
        )

    db.delete(report_card)
    db.commit()
    return {"message": "Report card deleted successfully"}


@router.post("/generate/{student_id}", response_model=schemas.ReportCardResponse)
def generate_report_card(
    student_id: int,
    academic_year: str,
    term: models.TermEnum,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin", "teacher"))
):
    """Auto-generate a report card for a student based on their grades and attendance"""
    # Verify student exists
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )

    # Calculate GPA from grades
    grades = db.query(models.Grade).join(models.Assignment).filter(
        models.Grade.student_id == student_id
    ).all()

    if not grades:
        gpa = 0.0
    else:
        total_percentage = sum(
            (grade.points_earned / grade.assignment.max_points) * 100
            for grade in grades
        )
        avg_percentage = total_percentage / len(grades)
        # Convert to 4.0 scale
        if avg_percentage >= 90:
            gpa = 4.0
        elif avg_percentage >= 80:
            gpa = 3.0
        elif avg_percentage >= 70:
            gpa = 2.0
        elif avg_percentage >= 60:
            gpa = 1.0
        else:
            gpa = 0.0

    # Calculate attendance percentage
    attendance = db.query(models.Attendance).filter(
        models.Attendance.student_id == student_id
    ).all()

    if not attendance:
        attendance_percentage = 0.0
    else:
        present_count = sum(
            1 for record in attendance
            if record.status in [models.AttendanceStatusEnum.present, models.AttendanceStatusEnum.late]
        )
        attendance_percentage = (present_count / len(attendance)) * 100

    # Get total students for ranking
    total_students = db.query(func.count(models.Student.id)).scalar()

    # Calculate class rank (simplified - based on GPA)
    students_with_higher_gpa = db.query(models.ReportCard).filter(
        models.ReportCard.academic_year == academic_year,
        models.ReportCard.term == term,
        models.ReportCard.gpa > gpa
    ).count()
    class_rank = students_with_higher_gpa + 1

    # Create report card
    report_card = models.ReportCard(
        student_id=student_id,
        academic_year=academic_year,
        term=term,
        gpa=round(gpa, 2),
        class_rank=class_rank,
        total_students=total_students,
        attendance_percentage=round(attendance_percentage, 1),
        conduct_grade="A",
        teacher_remarks="Auto-generated report card. Please update with personalized remarks.",
        principal_remarks="Auto-generated report card. Please update with personalized remarks."
    )

    db.add(report_card)
    db.flush()

    # Add default skill assessments
    default_skills = [
        {"skill_name": "Academic Performance", "score": avg_percentage if grades else 85.0},
        {"skill_name": "Participation", "score": 85.0},
        {"skill_name": "Assignment Completion", "score": 92.0},
        {"skill_name": "Behavior", "score": 95.0},
        {"skill_name": "Teamwork", "score": 88.0},
        {"skill_name": "Creativity", "score": 90.0}
    ]

    for skill_data in default_skills:
        skill = models.SkillAssessment(
            report_card_id=report_card.id,
            skill_name=skill_data["skill_name"],
            score=skill_data["score"]
        )
        db.add(skill)

    db.commit()
    db.refresh(report_card)
    return report_card
