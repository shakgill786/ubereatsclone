# app/models/menu_item.py

from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class MenuItem(db.Model):
    __tablename__ = 'menu_items'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255))
    image_url = db.Column(db.String(255), nullable=False)
    restaurant_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("restaurants.id")),
        nullable=False
    )
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    restaurant = db.relationship("Restaurant", back_populates="menu_items")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "price": self.price,
            "description": self.description,
            "imageUrl": self.image_url,
            "restaurantId": self.restaurant_id,
            "user_id": self.restaurant.user_id
        }
