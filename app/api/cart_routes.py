from flask import Blueprint, request
from app.models import db, CartItem
from flask_login import login_required, current_user

cart_routes = Blueprint('cart', __name__)

# View cart items
@cart_routes.route('', methods=['GET'])
@login_required
def get_cart_items():
    cart_items = CartItem.query.filter_by(user_id=current_user.id).all()
    return {"cart_items": [item.to_dict() for item in cart_items]}

# Add an item to cart
@cart_routes.route('', methods=['POST'])
@login_required
def add_cart_item():
    data = request.get_json()
    new_item = CartItem(
        user_id=current_user.id,
        menu_item_id=data['menu_item_id'],
        quantity=data.get('quantity', 1)
    )
    db.session.add(new_item)
    db.session.commit()
    return new_item.to_dict()

# Delete an item from cart
@cart_routes.route('/<int:cart_item_id>', methods=['DELETE'])
@login_required
def delete_cart_item(cart_item_id):
    cart_item = CartItem.query.get_or_404(cart_item_id)

    if cart_item.user_id != current_user.id:
        return {"error": "Unauthorized"}, 403

    db.session.delete(cart_item)
    db.session.commit()
    return {"message": "Cart item deleted successfully"}

# Checkout - clear all items from cart
@cart_routes.route('/checkout', methods=['POST'])
@login_required
def checkout_cart():
    cart_items = CartItem.query.filter_by(user_id=current_user.id).all()

    if not cart_items:
        return {"error": "Cart is already empty"}, 400

    for item in cart_items:
        db.session.delete(item)
    db.session.commit()
    return {"message": "Checkout successful"}
