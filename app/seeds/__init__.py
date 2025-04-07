from flask.cli import AppGroup
from app.models import db, User
from sqlalchemy.sql import text
import os

# ✅ Import other seed functions
from .restaurant_seeds import seed_restaurants, undo_restaurants
from .menu_item_seeds import seed_menu_items, undo_menu_items
from .favorite_seeds import seed_favorites, undo_favorites

# Environment setup
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# CLI seed command group
seed_commands = AppGroup('seed')

# ✅ Seed users with hashed passwords
def seed_users():
    users = [
        User(username="shak", email="shak@example.com", password="password1"),
        User(username="emma", email="emma@example.com", password="password2"),
        User(username="sehrish", email="sehrish@example.com", password="password3"),
    ]
    db.session.add_all(users)
    db.session.commit()

# ✅ Undo user seed data
def undo_users():
    if environment == "production":
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;"))
    else:
        db.session.execute(text("DELETE FROM users"))
    db.session.commit()

# ✅ Run all seed commands
@seed_commands.command('all')
def seed():
    if environment == 'production':
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.favorites RESTART IDENTITY CASCADE;"))
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.menu_items RESTART IDENTITY CASCADE;"))
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.restaurants RESTART IDENTITY CASCADE;"))
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;"))
        db.session.commit()

    # Undo first to prevent collisions
    undo_favorites()
    undo_menu_items()
    undo_restaurants()
    undo_users()

    # Reseed everything
    seed_users()
    seed_restaurants()
    seed_menu_items()
    seed_favorites()

# ✅ Undo all seed data
@seed_commands.command('undo')
def undo():
    undo_favorites()
    undo_menu_items()
    undo_restaurants()
    undo_users()
