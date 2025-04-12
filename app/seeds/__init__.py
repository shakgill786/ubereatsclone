from flask.cli import AppGroup
from app.models import db, User
from sqlalchemy.sql import text
import os

# Import other seed functions
from .restaurant_seeds import seed_restaurants, undo_restaurants
from .menu_item_seeds import seed_menu_items, undo_menu_items
from .favorite_seeds import seed_favorites, undo_favorites
#from .review_seeds import seed_reviews, undo_reviews  

# Environment setup
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# CLI group for seeding via terminal
seed_commands = AppGroup('seed')

# SEED USERS
def seed_users():
    users = [
        User(username="shak", email="shak@example.com", password="password1"),
        User(username="emma", email="emma@example.com", password="password2"),
        User(username="sehrish", email="sehrish@example.com", password="password3"),
    ]
    db.session.add_all(users)
    db.session.commit()

# UNDO USERS
def undo_users():
    if environment == "production":
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;"))
    else:
        db.session.execute(text("DELETE FROM users"))
    db.session.commit()

# FLASK COMMAND: SEED ALL
@seed_commands.command('all')
def seed():
    print("⚙️  Running full seed...")

    if environment == 'production':
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;"))
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.favorites RESTART IDENTITY CASCADE;"))
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.menu_items RESTART IDENTITY CASCADE;"))
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.restaurants RESTART IDENTITY CASCADE;"))
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;"))
        db.session.commit()

    undo_favorites()
    undo_menu_items()
    undo_restaurants()
    undo_users()

    seed_users()
    seed_restaurants()
    seed_menu_items()
    seed_favorites()

    print("✅ Database seeded.")

# FLASK COMMAND: UNDO ALL
@seed_commands.command('undo')
def undo():
    print("🔁 Reverting seed...")
    undo_reviews()       # ⬅️ Optional, if implemented
    undo_favorites()
    undo_menu_items()
    undo_restaurants()
    undo_users()
    print("✅ Seed undo complete.")

print("✅ Flask app module loaded successfully.")

# ❌ DISABLED: Auto-seed on deploy causes Render crashes
# Uncomment this only for local dev testing

# def auto_seed_if_empty():
#     from app.models import User
#     try:
#         if not User.query.first():
#             print("🚀 Running auto seed...")
#             seed()
#         else:
#             print("✅ Users already exist. Skipping seed.")
#     except Exception as e:
#         print("❌ Auto-seed error:", e)
