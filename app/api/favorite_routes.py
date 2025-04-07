from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import db, Favorite, Restaurant

favorite_routes = Blueprint('favorites', __name__)

@favorite_routes.route('/', methods=['GET'])
@login_required
def get_favorites():
    favorites = Favorite.query.filter_by(user_id=current_user.id).all()
    restaurant_ids = [f.restaurant_id for f in favorites]
    restaurants = Restaurant.query.filter(Restaurant.id.in_(restaurant_ids)).all()
    return jsonify([r.to_dict() for r in restaurants])

@favorite_routes.route('/<int:restaurant_id>', methods=['POST'])
@login_required
def toggle_favorite(restaurant_id):
    favorite = Favorite.query.filter_by(user_id=current_user.id, restaurant_id=restaurant_id).first()
    if favorite:
        db.session.delete(favorite)
        db.session.commit()
        return {"message": "Removed from favorites", "favorite": None}
    else:
        new_fav = Favorite(user_id=current_user.id, restaurant_id=restaurant_id)
        db.session.add(new_fav)
        db.session.commit()
        return {"message": "Added to favorites", "favorite": new_fav.to_dict()}, 201
