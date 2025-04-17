from app.models import db, Restaurant
from sqlalchemy.sql import text
import os

environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

def seed_restaurants():
    restaurants = [
        Restaurant(
            name="Sunset Grill",
            address="123 Ocean Ave, San Diego, CA",
            cuisine="Seafood",
            user_id=1,
            image_url="https://images.unsplash.com/photo-1553621042-f6e147245754"
        ),
        Restaurant(
            name="Mountain Deli",
            address="88 Alpine Road, Denver, CO",
            cuisine="Sandwiches",
            user_id=2,
            image_url="https://images.unsplash.com/photo-1551782450-a2132b4ba21d"
        ),
        Restaurant(
            name="Tandoori Flame",
            address="56 Curry Blvd, Houston, TX",
            cuisine="Indian",
            user_id=3,
            image_url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr8eckIRPUD4dyVkCHgET5u0KX2yz6o_bn2g&s"
        )
    ]
    db.session.add_all(restaurants)
    db.session.commit()

def undo_restaurants():
    if environment == "production":
        db.session.execute(text(f"TRUNCATE table {SCHEMA}.restaurants RESTART IDENTITY CASCADE;"))
    else:
        db.session.execute(text("DELETE FROM restaurants"))

    db.session.commit()
