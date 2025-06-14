from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from .db import db, environment, SCHEMA, add_prefix_for_prod

class User(db.Model, UserMixin):
    __tablename__ = "users"
    __table_args__ = ({"schema": SCHEMA},) if environment == "production" else {}

    id             = db.Column(db.Integer, primary_key=True)
    username       = db.Column(db.String(50),  nullable=False, unique=True)
    email          = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    role           = db.Column(db.String(20), nullable=False, default="student")
    created_at     = db.Column(db.DateTime, default=datetime.utcnow)

    # ─── Relationships ────────────────────────────────────────────────────
    restaurants = db.relationship(
        "Restaurant",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    favorites   = db.relationship(
        "Favorite",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    cart_items  = db.relationship(
        "CartItem",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    reviews     = db.relationship(
        "Review",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    # ─── Password hashing helpers ────────────────────────────────────────────
    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, raw):
        self.hashed_password = generate_password_hash(raw)

    def check_password(self, raw):
        return check_password_hash(self.hashed_password, raw)

    # ─── Serialization ──────────────────────────────────────────────────────
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
        }
