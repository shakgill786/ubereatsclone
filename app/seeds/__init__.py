from flask.cli import AppGroup
from app.models import db
from sqlalchemy.sql import text
import os

# ✅ IMPORT FROM YOUR SEED FILE
from .users import seed_users, undo_users
from .restaurant_seeds import seed_restaurants, undo_restaurants
from .menu_item_seeds import seed_menu_items, undo_menu_items
from .favorite_seeds import seed_favorites, undo_favorites
# from .review_seeds import seed_reviews, undo_reviews

# Environment setup
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# CLI group for seeding via terminal
seed_commands = AppGroup('seed')

@seed_commands.command('all')
def seed():
    print("⚙️  Running full seed...")

    if environment == 'production':
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.favorites RESTART IDENTITY CASCADE;"))
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.menu_items RESTART IDENTITY CASCADE;"))
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.restaurants RESTART IDENTITY CASCADE;"))
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;"))
        db.session.commit()

    undo_favorites()
    undo_menu_items()
    undo_restaurants()
    undo_users()

    seed_users()  # ✅ This now seeds the demo user
    seed_restaurants()
    seed_menu_items()
    seed_favorites()

    print("✅ Database seeded.")

@seed_commands.command('undo')
def undo():
    print("🔁 Reverting seed...")
    # undo_reviews()       # ⬅️ Optional if implemented
    undo_favorites()
    undo_menu_items()
    undo_restaurants()
    undo_users()
    print("✅ Seed undo complete.")
