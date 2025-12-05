"""
Development-only database initialization with demo accounts.
USE ONLY FOR TESTING/DEVELOPMENT - NOT FOR PRODUCTION!
"""
from database import Base, engine, SessionLocal
from models import (
    User, Teacher, Student, Course, Enrollment, Assignment, Grade, Attendance,
    Announcement, ReportCard, SkillAssessment, FeeStructure, FeeRecord
)
from auth import get_password_hash
from models import RoleEnum
from datetime import date


def init_database(drop_existing=False):
    """Initialize database tables."""
    if drop_existing:
        print("WARNING: Dropping existing tables and ALL DATA...")
        Base.metadata.drop_all(bind=engine)
        print("Existing tables dropped.")

    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")


def seed_demo_data():
    """Seed database with demo accounts - FOR DEVELOPMENT ONLY"""
    db = SessionLocal()

    try:
        existing_admin = db.query(User).filter(User.email == "admin@kastra.com").first()
        if existing_admin:
            print("Demo data already exists. Skipping.")
            return

        print("Creating demo accounts...")

        # Admin
        admin_user = User(
            email="admin@kastra.com",
            password_hash=get_password_hash("admin123"),
            first_name="Admin",
            last_name="User",
            role=RoleEnum.admin
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

        # Teacher
        teacher_user = User(
            email="teacher@kastra.com",
            password_hash=get_password_hash("teacher123"),
            first_name="Jane",
            last_name="Smith",
            role=RoleEnum.teacher
        )
        db.add(teacher_user)
        db.commit()
        db.refresh(teacher_user)

        teacher = Teacher(
            user_id=teacher_user.id,
            phone="+1234567890",
            department="Computer Science"
        )
        db.add(teacher)
        db.commit()

        # Student
        student_user = User(
            email="student@kastra.com",
            password_hash=get_password_hash("student123"),
            first_name="John",
            last_name="Doe",
            role=RoleEnum.student
        )
        db.add(student_user)
        db.commit()
        db.refresh(student_user)

        student = Student(
            user_id=student_user.id,
            phone="+1234567891",
            address="123 Student St",
            grade_level=10,
            student_id="STU001",
            admission_date=date(2024, 9, 1),
            guardian_name="Jane Doe",
            guardian_phone="+1234567892",
            guardian_email="guardian@example.com"
        )
        db.add(student)
        db.commit()

        print("\nDemo accounts created!")
        print("Admin: admin@kastra.com / admin123")
        print("Teacher: teacher@kastra.com / teacher123")
        print("Student: student@kastra.com / student123")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    print("⚠️  WARNING: This script creates demo accounts for DEVELOPMENT ONLY!")
    print("⚠️  DO NOT use this in production!")
    print()
    init_database()
    seed_demo_data()
