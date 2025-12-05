from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Date, Float, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base


class RoleEnum(str, enum.Enum):
    admin = "admin"
    teacher = "teacher"
    student = "student"


class AttendanceStatusEnum(str, enum.Enum):
    present = "present"
    absent = "absent"
    late = "late"


class PaymentStatusEnum(str, enum.Enum):
    paid = "paid"
    pending = "pending"
    unpaid = "unpaid"
    overdue = "overdue"


class TermEnum(str, enum.Enum):
    fall = "fall"
    spring = "spring"
    summer = "summer"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    teacher = relationship("Teacher", back_populates="user", uselist=False)
    student = relationship("Student", back_populates="user", uselist=False)
    announcements = relationship("Announcement", back_populates="created_by")


class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    phone = Column(String)
    department = Column(String)

    # Relationships
    user = relationship("User", back_populates="teacher")
    courses = relationship("Course", back_populates="teacher")


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    phone = Column(String)
    date_of_birth = Column(Date)
    address = Column(Text)
    grade_level = Column(Integer)
    student_id = Column(String, unique=True)
    admission_date = Column(Date)
    guardian_name = Column(String)
    guardian_phone = Column(String)
    guardian_email = Column(String)

    # Relationships
    user = relationship("User", back_populates="student")
    enrollments = relationship("Enrollment", back_populates="student")
    attendance_records = relationship("Attendance", back_populates="student")
    grades = relationship("Grade", back_populates="student")
    report_cards = relationship("ReportCard", back_populates="student")
    fee_records = relationship("FeeRecord", back_populates="student")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, nullable=False)
    description = Column(Text)
    teacher_id = Column(Integer, ForeignKey("teachers.id"))
    credits = Column(Integer, default=3)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    teacher = relationship("Teacher", back_populates="courses")
    enrollments = relationship("Enrollment", back_populates="course")
    assignments = relationship("Assignment", back_populates="course")
    attendance_records = relationship("Attendance", back_populates="course")


class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    enrolled_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String, nullable=False)
    description = Column(Text)
    due_date = Column(DateTime)
    max_points = Column(Float, default=100.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    course = relationship("Course", back_populates="assignments")
    grades = relationship("Grade", back_populates="assignment")


class Grade(Base):
    __tablename__ = "grades"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    assignment_id = Column(Integer, ForeignKey("assignments.id"))
    points_earned = Column(Float)
    feedback = Column(Text)
    graded_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="grades")
    assignment = relationship("Assignment", back_populates="grades")


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    date = Column(Date, nullable=False)
    status = Column(Enum(AttendanceStatusEnum), nullable=False)
    notes = Column(Text)

    # Relationships
    student = relationship("Student", back_populates="attendance_records")
    course = relationship("Course", back_populates="attendance_records")


class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    target_audience = Column(String, default="all")
    created_by_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    created_by = relationship("User", back_populates="announcements")


class ReportCard(Base):
    __tablename__ = "report_cards"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    academic_year = Column(String, nullable=False)
    term = Column(Enum(TermEnum), nullable=False)
    gpa = Column(Float)
    class_rank = Column(Integer)
    total_students = Column(Integer)
    attendance_percentage = Column(Float)
    conduct_grade = Column(String)
    teacher_remarks = Column(Text)
    principal_remarks = Column(Text)
    generated_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="report_cards")
    skill_assessments = relationship("SkillAssessment", back_populates="report_card", cascade="all, delete-orphan")


class SkillAssessment(Base):
    __tablename__ = "skill_assessments"

    id = Column(Integer, primary_key=True, index=True)
    report_card_id = Column(Integer, ForeignKey("report_cards.id"))
    skill_name = Column(String, nullable=False)
    score = Column(Float, nullable=False)

    # Relationships
    report_card = relationship("ReportCard", back_populates="skill_assessments")


class FeeStructure(Base):
    __tablename__ = "fee_structures"

    id = Column(Integer, primary_key=True, index=True)
    academic_year = Column(String, nullable=False)
    grade_level = Column(Integer, nullable=False)
    tuition = Column(Float, default=0.0)
    lab = Column(Float, default=0.0)
    library = Column(Float, default=0.0)
    sports = Column(Float, default=0.0)
    technology = Column(Float, default=0.0)
    activities = Column(Float, default=0.0)
    transport = Column(Float, default=0.0)
    meals = Column(Float, default=0.0)
    uniforms = Column(Float, default=0.0)
    books = Column(Float, default=0.0)
    examination = Column(Float, default=0.0)
    insurance = Column(Float, default=0.0)
    development_fee = Column(Float, default=0.0)
    misc = Column(Float, default=0.0)
    total_annual = Column(Float, default=0.0)
    sibling_discount = Column(Float, default=0.10)
    merit_discount = Column(Float, default=0.05)
    early_payment_discount = Column(Float, default=0.02)
    late_fee = Column(Float, default=500.0)
    refund_policy = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class FeeRecord(Base):
    __tablename__ = "fee_records"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    academic_year = Column(String, nullable=False)
    term = Column(Enum(TermEnum), nullable=False)
    amount = Column(Float, nullable=False)
    due_date = Column(Date, nullable=False)
    status = Column(Enum(PaymentStatusEnum), default=PaymentStatusEnum.unpaid)
    paid_date = Column(Date)
    payment_method = Column(String)
    transaction_id = Column(String)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="fee_records")
