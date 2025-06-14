from .db import db, environment, SCHEMA, add_prefix_for_prod

from .user import User
from .restaurant import Restaurant
from .menu_item import MenuItem
from .favorites import Favorite
from .cart_item import CartItem
from .review import Review

__all__ = [
    "db",
    "environment",
    "SCHEMA",
    "add_prefix_for_prod",
    "User",
    "Restaurant",
    "MenuItem",
    "Favorite",
    "CartItem",
    "Review",
]
