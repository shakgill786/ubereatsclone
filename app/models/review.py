from .db import db, environment, SCHEMA, add_prefix_for_prod

class Review(db.Model):
    __tablename__ = "reviews"
    __table_args__ = ({"schema": SCHEMA},) if environment == "production" else {}

    id            = db.Column(db.Integer, primary_key=True)
    comment       = db.Column(db.String(255), nullable=False)
    rating        = db.Column(db.Integer, nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("restaurants.id")), nullable=False)
    user_id       = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)

    user         = db.relationship("User", back_populates="reviews")
    restaurant   = db.relationship("Restaurant", back_populates="reviews")

    def to_dict(self):
        return {
            "id": self.id,
            "comment": self.comment,
            "rating": self.rating,
            "restaurant_id": self.restaurant_id,
            "user_id": self.user_id,
        }
