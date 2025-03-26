from flask.cli import AppGroup
from app.models import db, User
from sqlalchemy.sql import text
import os

# ✅ Import restaurant seed functions
from .restaurant_seeds import seed_restaurants, undo_restaurants

# Get environment variables
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# Create a seed group to allow CLI commands: `flask seed all` & `flask seed undo`
seed_commands = AppGroup('seed')

# ✅ FUNCTION TO SEED USERS
def seed_users():
    users = [
        User(username="shak", email="shak@example.com", hashed_password="hashed_password_1"),
        User(username="emma", email="emma@example.com", hashed_password="hashed_password_2"),
        User(username="sehrish", email="sehrish@example.com", hashed_password="hashed_password_3")
    ]

    db.session.add_all(users)
    db.session.commit()

# ✅ FUNCTION TO UNDO USERS (for reseeding)
def undo_users():
    if environment == "production":
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;"))
    else:
        db.session.execute(text("DELETE FROM users"))
    db.session.commit()

# ✅ SEED COMMAND: RUN ALL SEEDS
@seed_commands.command('all')
def seed():
    if environment == 'production':
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.restaurants RESTART IDENTITY CASCADE;"))
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;"))
        db.session.commit()

    seed_users()
    seed_restaurants()

# ✅ SEED COMMAND: UNDO ALL SEEDS
@seed_commands.command('undo')
def undo():
    undo_restaurants()
    undo_users()
