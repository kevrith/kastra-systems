from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date, datetime
from database import get_db
import models
import schemas
from auth import get_current_user, require_role

router = APIRouter(prefix="/fees", tags=["Fees"])


# Fee Structure Routes
@router.get("/structures", response_model=List[schemas.FeeStructureResponse])
def get_all_fee_structures(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    """Get all fee structures"""
    structures = db.query(models.FeeStructure).all()
    return structures


@router.get("/structures/{academic_year}/{grade_level}", response_model=schemas.FeeStructureResponse)
def get_fee_structure(
    academic_year: str,
    grade_level: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get fee structure for a specific academic year and grade level"""
    structure = db.query(models.FeeStructure).filter(
        models.FeeStructure.academic_year == academic_year,
        models.FeeStructure.grade_level == grade_level
    ).first()

    if not structure:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fee structure not found for this academic year and grade level"
        )

    return structure


@router.post("/structures", response_model=schemas.FeeStructureResponse)
def create_fee_structure(
    structure_data: schemas.FeeStructureCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    """Create a new fee structure"""
    # Check if structure already exists
    existing = db.query(models.FeeStructure).filter(
        models.FeeStructure.academic_year == structure_data.academic_year,
        models.FeeStructure.grade_level == structure_data.grade_level
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Fee structure already exists for this academic year and grade level"
        )

    structure = models.FeeStructure(**structure_data.dict())
    db.add(structure)
    db.commit()
    db.refresh(structure)
    return structure


@router.put("/structures/{structure_id}", response_model=schemas.FeeStructureResponse)
def update_fee_structure(
    structure_id: int,
    structure_data: schemas.FeeStructureUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    """Update a fee structure"""
    structure = db.query(models.FeeStructure).filter(
        models.FeeStructure.id == structure_id
    ).first()

    if not structure:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fee structure not found"
        )

    # Update fields
    for key, value in structure_data.dict(exclude_unset=True).items():
        setattr(structure, key, value)

    db.commit()
    db.refresh(structure)
    return structure


@router.delete("/structures/{structure_id}")
def delete_fee_structure(
    structure_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    """Delete a fee structure"""
    structure = db.query(models.FeeStructure).filter(
        models.FeeStructure.id == structure_id
    ).first()

    if not structure:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fee structure not found"
        )

    db.delete(structure)
    db.commit()
    return {"message": "Fee structure deleted successfully"}


# Fee Record Routes
@router.get("/records", response_model=List[schemas.FeeRecordResponse])
def get_all_fee_records(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    """Get all fee records"""
    records = db.query(models.FeeRecord).all()
    return records


@router.get("/records/student/{student_id}", response_model=List[schemas.FeeRecordResponse])
def get_student_fee_records(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get all fee records for a specific student"""
    # Verify student exists
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )

    # Students can only view their own fee records
    if current_user.role == models.RoleEnum.student:
        user_student = db.query(models.Student).filter(
            models.Student.user_id == current_user.id
        ).first()
        if user_student.id != student_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this student's fee records"
            )

    records = db.query(models.FeeRecord).filter(
        models.FeeRecord.student_id == student_id
    ).order_by(models.FeeRecord.due_date.desc()).all()

    return records


@router.get("/records/{record_id}", response_model=schemas.FeeRecordResponse)
def get_fee_record(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get a specific fee record"""
    record = db.query(models.FeeRecord).filter(
        models.FeeRecord.id == record_id
    ).first()

    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fee record not found"
        )

    # Students can only view their own fee records
    if current_user.role == models.RoleEnum.student:
        user_student = db.query(models.Student).filter(
            models.Student.user_id == current_user.id
        ).first()
        if record.student_id != user_student.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this fee record"
            )

    return record


@router.post("/records", response_model=schemas.FeeRecordResponse)
def create_fee_record(
    record_data: schemas.FeeRecordCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    """Create a new fee record"""
    # Verify student exists
    student = db.query(models.Student).filter(
        models.Student.id == record_data.student_id
    ).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )

    record = models.FeeRecord(**record_data.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.put("/records/{record_id}", response_model=schemas.FeeRecordResponse)
def update_fee_record(
    record_id: int,
    record_data: schemas.FeeRecordUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    """Update a fee record (typically to mark as paid)"""
    record = db.query(models.FeeRecord).filter(
        models.FeeRecord.id == record_id
    ).first()

    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fee record not found"
        )

    # Update fields
    for key, value in record_data.dict(exclude_unset=True).items():
        setattr(record, key, value)

    # Auto-update status to overdue if past due date and unpaid
    if record.status == models.PaymentStatusEnum.unpaid and record.due_date < date.today():
        record.status = models.PaymentStatusEnum.overdue

    db.commit()
    db.refresh(record)
    return record


@router.delete("/records/{record_id}")
def delete_fee_record(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    """Delete a fee record"""
    record = db.query(models.FeeRecord).filter(
        models.FeeRecord.id == record_id
    ).first()

    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fee record not found"
        )

    db.delete(record)
    db.commit()
    return {"message": "Fee record deleted successfully"}


@router.post("/records/generate/{student_id}")
def generate_fee_records(
    student_id: int,
    academic_year: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    """Auto-generate fee records for a student based on fee structure"""
    # Verify student exists
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )

    # Get fee structure for student's grade level
    structure = db.query(models.FeeStructure).filter(
        models.FeeStructure.academic_year == academic_year,
        models.FeeStructure.grade_level == student.grade_level
    ).first()

    if not structure:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Fee structure not found for academic year {academic_year} and grade level {student.grade_level}"
        )

    # Check if records already exist
    existing = db.query(models.FeeRecord).filter(
        models.FeeRecord.student_id == student_id,
        models.FeeRecord.academic_year == academic_year
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Fee records already exist for this student and academic year"
        )

    # Generate fee records for three terms
    year = int(academic_year.split('-')[0])
    terms = [
        {
            "term": models.TermEnum.fall,
            "due_date": date(year, 8, 15),
            "amount": structure.total_annual * 0.35
        },
        {
            "term": models.TermEnum.spring,
            "due_date": date(year + 1, 1, 15),
            "amount": structure.total_annual * 0.35
        },
        {
            "term": models.TermEnum.summer,
            "due_date": date(year + 1, 5, 15),
            "amount": structure.total_annual * 0.30
        }
    ]

    created_records = []
    for term_data in terms:
        record = models.FeeRecord(
            student_id=student_id,
            academic_year=academic_year,
            term=term_data["term"],
            amount=round(term_data["amount"], 2),
            due_date=term_data["due_date"],
            status=models.PaymentStatusEnum.unpaid
        )
        db.add(record)
        created_records.append(record)

    db.commit()
    for record in created_records:
        db.refresh(record)

    return {
        "message": "Fee records generated successfully",
        "records_count": len(created_records),
        "total_amount": structure.total_annual
    }
