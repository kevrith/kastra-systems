from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Optional, List
from models import RoleEnum, AttendanceStatusEnum, PaymentStatusEnum, TermEnum


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    role: RoleEnum


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# Teacher Schemas
class TeacherBase(BaseModel):
    phone: Optional[str] = None
    department: Optional[str] = None


class TeacherCreate(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    password: str
    phone: Optional[str] = None
    department: Optional[str] = None


class TeacherResponse(TeacherBase):
    id: int
    user: UserResponse

    class Config:
        from_attributes = True


# Student Schemas
class StudentBase(BaseModel):
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    address: Optional[str] = None
    grade_level: Optional[int] = None
    student_id: Optional[str] = None
    admission_date: Optional[date] = None
    guardian_name: Optional[str] = None
    guardian_phone: Optional[str] = None
    guardian_email: Optional[str] = None


class StudentCreate(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    password: str
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    address: Optional[str] = None
    grade_level: Optional[int] = None
    student_id: Optional[str] = None
    admission_date: Optional[date] = None
    guardian_name: Optional[str] = None
    guardian_phone: Optional[str] = None
    guardian_email: Optional[str] = None


class StudentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    address: Optional[str] = None
    grade_level: Optional[int] = None
    student_id: Optional[str] = None
    admission_date: Optional[date] = None
    guardian_name: Optional[str] = None
    guardian_phone: Optional[str] = None
    guardian_email: Optional[str] = None


class StudentResponse(StudentBase):
    id: int
    user: UserResponse

    class Config:
        from_attributes = True


# Course Schemas
class CourseBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    credits: int = 3


class CourseCreate(CourseBase):
    teacher_id: int


class CourseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    teacher_id: Optional[int] = None
    credits: Optional[int] = None


class CourseResponse(CourseBase):
    id: int
    teacher_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Enrollment Schemas
class EnrollmentCreate(BaseModel):
    student_id: int
    course_id: int


class EnrollmentResponse(BaseModel):
    id: int
    student_id: int
    course_id: int
    enrolled_at: datetime

    class Config:
        from_attributes = True


# Assignment Schemas
class AssignmentBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    max_points: float = 100.0


class AssignmentCreate(AssignmentBase):
    course_id: int


class AssignmentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    max_points: Optional[float] = None


class AssignmentResponse(AssignmentBase):
    id: int
    course_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Grade Schemas
class GradeBase(BaseModel):
    points_earned: float
    feedback: Optional[str] = None


class GradeCreate(GradeBase):
    student_id: int
    assignment_id: int


class GradeUpdate(BaseModel):
    points_earned: Optional[float] = None
    feedback: Optional[str] = None


class GradeResponse(GradeBase):
    id: int
    student_id: int
    assignment_id: int
    graded_at: datetime

    class Config:
        from_attributes = True


# Attendance Schemas
class AttendanceBase(BaseModel):
    date: date
    status: AttendanceStatusEnum
    notes: Optional[str] = None


class AttendanceCreate(AttendanceBase):
    student_id: int
    course_id: int


class AttendanceResponse(AttendanceBase):
    id: int
    student_id: int
    course_id: int

    class Config:
        from_attributes = True


# Announcement Schemas
class AnnouncementBase(BaseModel):
    title: str
    content: str
    target_audience: str = "all"


class AnnouncementCreate(AnnouncementBase):
    pass


class AnnouncementResponse(AnnouncementBase):
    id: int
    created_by_id: int
    created_by_name: str
    created_at: datetime

    class Config:
        from_attributes = True


# Dashboard Schemas
class DashboardStats(BaseModel):
    total_students: int
    total_teachers: int
    total_courses: int
    total_enrollments: int


# Report Card Schemas
class SkillAssessmentBase(BaseModel):
    skill_name: str
    score: float


class SkillAssessmentResponse(SkillAssessmentBase):
    id: int
    report_card_id: int

    class Config:
        from_attributes = True


class ReportCardBase(BaseModel):
    academic_year: str
    term: TermEnum
    gpa: Optional[float] = None
    class_rank: Optional[int] = None
    total_students: Optional[int] = None
    attendance_percentage: Optional[float] = None
    conduct_grade: Optional[str] = "A"
    teacher_remarks: Optional[str] = None
    principal_remarks: Optional[str] = None


class ReportCardCreate(ReportCardBase):
    student_id: int
    skill_assessments: Optional[List[SkillAssessmentBase]] = []


class ReportCardUpdate(BaseModel):
    gpa: Optional[float] = None
    class_rank: Optional[int] = None
    total_students: Optional[int] = None
    attendance_percentage: Optional[float] = None
    conduct_grade: Optional[str] = None
    teacher_remarks: Optional[str] = None
    principal_remarks: Optional[str] = None


class ReportCardResponse(ReportCardBase):
    id: int
    student_id: int
    generated_at: datetime
    updated_at: datetime
    skill_assessments: List[SkillAssessmentResponse] = []

    class Config:
        from_attributes = True


# Fee Structure Schemas
class FeeStructureBase(BaseModel):
    academic_year: str
    grade_level: int
    tuition: float = 0.0
    lab: float = 0.0
    library: float = 0.0
    sports: float = 0.0
    technology: float = 0.0
    activities: float = 0.0
    transport: float = 0.0
    meals: float = 0.0
    uniforms: float = 0.0
    books: float = 0.0
    examination: float = 0.0
    insurance: float = 0.0
    development_fee: float = 0.0
    misc: float = 0.0
    total_annual: float = 0.0
    sibling_discount: float = 0.10
    merit_discount: float = 0.05
    early_payment_discount: float = 0.02
    late_fee: float = 500.0
    refund_policy: Optional[str] = None


class FeeStructureCreate(FeeStructureBase):
    pass


class FeeStructureUpdate(BaseModel):
    tuition: Optional[float] = None
    lab: Optional[float] = None
    library: Optional[float] = None
    sports: Optional[float] = None
    technology: Optional[float] = None
    activities: Optional[float] = None
    transport: Optional[float] = None
    meals: Optional[float] = None
    uniforms: Optional[float] = None
    books: Optional[float] = None
    examination: Optional[float] = None
    insurance: Optional[float] = None
    development_fee: Optional[float] = None
    misc: Optional[float] = None
    total_annual: Optional[float] = None
    sibling_discount: Optional[float] = None
    merit_discount: Optional[float] = None
    early_payment_discount: Optional[float] = None
    late_fee: Optional[float] = None
    refund_policy: Optional[str] = None


class FeeStructureResponse(FeeStructureBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Fee Record Schemas
class FeeRecordBase(BaseModel):
    academic_year: str
    term: TermEnum
    amount: float
    due_date: date
    status: PaymentStatusEnum = PaymentStatusEnum.unpaid
    payment_method: Optional[str] = None
    notes: Optional[str] = None


class FeeRecordCreate(FeeRecordBase):
    student_id: int


class FeeRecordUpdate(BaseModel):
    status: Optional[PaymentStatusEnum] = None
    paid_date: Optional[date] = None
    payment_method: Optional[str] = None
    transaction_id: Optional[str] = None
    notes: Optional[str] = None


class FeeRecordResponse(FeeRecordBase):
    id: int
    student_id: int
    paid_date: Optional[date] = None
    transaction_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
