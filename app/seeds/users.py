# app/seeds/users.py

from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text

def seed_users():
    demo_student = User(
        username="Demo Student",
        email="demo@student.com",
        password="password",
        role="student"
    )
    demo_instructor = User(
        username="Demo Instructor",
        email="demo@instructor.com",
        password="password",
        role="instructor"
    )
    for u in (demo_student, demo_instructor):
        if not User.query.filter_by(email=u.email).first():
            db.session.add(u)
    db.session.commit()

def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users;"))
    db.session.commit()
