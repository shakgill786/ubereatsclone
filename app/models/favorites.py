from .db import db, environment, SCHEMA, add_prefix_for_prod

class Favorite(db.Model):
    __tablename__ = "favorites"
    __table_args__ = ({"schema": SCHEMA},) if environment == "production" else {}

    id            = db.Column(db.Integer, primary_key=True)
    user_id       = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("restaurants.id")), nullable=False)

    user       = db.relationship("User", back_populates="favorites")
    restaurant = db.relationship("Restaurant", back_populates="favorited_by")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "restaurant_id": self.restaurant_id,
        }