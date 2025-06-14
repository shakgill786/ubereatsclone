# app/seeds/__init__.py

import os
from flask.cli import AppGroup
from sqlalchemy.sql import text
from app.models import db

# ✅ IMPORT YOUR INDIVIDUAL seed/undo FUNCTIONS
from .users import seed_users, undo_users
from .restaurant_seeds import seed_restaurants, undo_restaurants
from .menu_item_seeds import seed_menu_items, undo_menu_items
from .favorite_seeds import seed_favorites, undo_favorites
# from .review_seeds import seed_reviews, undo_reviews  # if you add reviews later

# grab environment vars
environment = os.getenv("FLASK_ENV")
SCHEMA = os.getenv("SCHEMA")

# create a seed command group
seed_commands = AppGroup("seed")


@seed_commands.command("all")
def seed():
    """Seed (or re‐seed) the entire database."""
    print("⚙️  Running full seed...")

    # in production, we want to TRUNCATE instead of DELETE to reset PKs
    if environment == "production":
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.favorites RESTART IDENTITY CASCADE;"))
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.menu_items RESTART IDENTITY CASCADE;"))
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.restaurants RESTART IDENTITY CASCADE;"))
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;"))
        db.session.commit()

    # undo in reverse order of creation
    undo_favorites()
    undo_menu_items()
    undo_restaurants()
    undo_users()
    # if you add reviews: undo_reviews()

    # then seed in logical order
    seed_users()
    seed_restaurants()
    seed_menu_items()
    seed_favorites()
    # if you add reviews: seed_reviews()

    print("✅ Database seeded.")


@seed_commands.command("undo")
def undo():
    """Drop all seeded data (but keep tables intact)."""
    print("🔁 Reverting seed...")

    # undo in reverse order of dependencies
    # if you add reviews: undo_reviews()
    undo_favorites()
    undo_menu_items()
    undo_restaurants()
    undo_users()

    print("✅ Seed undo complete.")
