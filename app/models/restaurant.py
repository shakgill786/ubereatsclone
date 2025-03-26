from .db import db, environment, SCHEMA, add_prefix_for_prod

class Restaurant(db.Model):
    __tablename__ = 'restaurants'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    cuisine = db.Column(db.String(100))
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    image_url = db.Column(db.String(500))
    user = db.relationship("User", backref="restaurants")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "address": self.address,
            "cuisine": self.cuisine,
            "user_id": self.user_id,
            "image_url": self.image_url
    }

