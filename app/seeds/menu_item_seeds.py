from app.models import db, MenuItem
from sqlalchemy.sql import text
import datetime
import os

environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

def seed_menu_items():
    items = [
        MenuItem(
            name="Classic Burger",
            type="entree",
            price=11.99,
            description="Juicy grilled beef patty with lettuce and tomato.",
            image_url="https://example.com/burger.jpg",
            restaurant_id=1,
            created_at=datetime.datetime.now(),
            updated_at=datetime.datetime.now()
        ),
        MenuItem(
            name="Caesar Salad",
            type="appetizer",
            price=8.99,
            description="Romaine with Caesar dressing and croutons.",
            image_url="https://example.com/salad.jpg",
            restaurant_id=1,
            created_at=datetime.datetime.now(),
            updated_at=datetime.datetime.now()
        )
    ]
    db.session.add_all(items)
    db.session.commit()

def undo_menu_items():
    if environment == "production":
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.menu_items RESTART IDENTITY CASCADE;"))
    else:
        db.session.execute(text("DELETE FROM menu_items"))
    db.session.commit()
