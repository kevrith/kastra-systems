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
    """
    Initialize database with minimal seed data (no demo accounts).
    For production use - creates empty database ready for registration.
    """
    db = SessionLocal()

    try:
        # Check if database already has users
        existing_users = db.query(User).first()
        if existing_users:
            print("Database already has users. Skipping seed data creation.")
            return

        print("Initializing database for production...")
        print("Database is ready. Register your first admin account through the frontend.")

    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_database()
    seed_data()
