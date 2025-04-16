from .db import db, environment, SCHEMA, add_prefix_for_prod

class CartItem(db.Model):
    __tablename__ = 'cart_items'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    menu_item_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('menu_items.id')), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    # Relationships
    user = db.relationship('User', back_populates='cart_items')
    menu_item = db.relationship('MenuItem')

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "menu_item_id": self.menu_item_id,
            "quantity": self.quantity,
            "menu_item": self.menu_item.to_dict()
        }
