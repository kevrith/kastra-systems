from database import Base, engine, SessionLocal
from models import (
    User, Teacher, Student, Course, Enrollment, Assignment, Grade, Attendance,
    Announcement, ReportCard, SkillAssessment, FeeStructure, FeeRecord
)
from auth import get_password_hash
from models import RoleEnum
from datetime import date


def init_database(drop_existing=False):
    """
    Initialize database tables.

    Args:
        drop_existing: If True, drops all existing tables first (WARNING: deletes all data!)
    """
    if drop_existing:
        print("WARNING: Dropping existing tables and ALL DATA...")
        Base.metadata.drop_all(bind=engine)
        print("Existing tables dropped.")

    print("Creating database tables (if they don't exist)...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")


def seed_data():
    db = SessionLocal()

    try:
        # Check if admin already exists
        existing_admin = db.query(User).filter(User.email == "admin@kastra.com").first()
        if existing_admin:
            print("Database already seeded. Skipping seed data creation.")
            return

        print("Seeding initial data...")

        # Create admin user
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
        print(f"Created admin user: {admin_user.email}")

        # Create sample teacher
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
        db.refresh(teacher)
        print(f"Created teacher: {teacher_user.email}")

        # Create sample student
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
            address="123 Student St, City, Country",
            grade_level=10,
            student_id="STU001",
            admission_date=date(2024, 9, 1),
            guardian_name="Jane Doe",
            guardian_phone="+1234567892",
            guardian_email="guardian@example.com"
        )
        db.add(student)
        db.commit()
        db.refresh(student)
        print(f"Created student: {student_user.email}")

        # Create sample course
        course = Course(
            name="Introduction to Programming",
            code="CS101",
            description="Learn the basics of programming with Python",
            teacher_id=teacher.id,
            credits=3
        )
        db.add(course)
        db.commit()
        db.refresh(course)
        print(f"Created course: {course.name}")

        # Create sample announcement
        announcement = Announcement(
            title="Welcome to Kastra Systems!",
            content="Welcome to the new school management system. Please explore and familiarize yourself with the platform.",
            target_audience="all",
            created_by_id=admin_user.id
        )
        db.add(announcement)
        db.commit()
        print("Created welcome announcement")

        # Create sample fee structure for grade 10
        fee_structure = FeeStructure(
            academic_year="2024-2025",
            grade_level=10,
            tuition=18000,
            lab=2000,
            library=1500,
            sports=1000,
            technology=2500,
            activities=1200,
            transport=3000,
            meals=4000,
            uniforms=800,
            books=2000,
            examination=1000,
            insurance=500,
            development_fee=3000,
            misc=500,
            total_annual=41000,
            sibling_discount=0.10,
            merit_discount=0.05,
            early_payment_discount=0.02,
            late_fee=500,
            refund_policy="Refundable within 30 days of admission with 20% processing fee"
        )
        db.add(fee_structure)
        db.commit()
        print("Created fee structure for Grade 10")

        print("\nSeed data created successfully!")
        print("\nDefault login credentials:")
        print("Admin - Email: admin@kastra.com, Password: admin123")
        print("Teacher - Email: teacher@kastra.com, Password: teacher123")
        print("Student - Email: student@kastra.com, Password: student123")

    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_database()
    seed_data()
