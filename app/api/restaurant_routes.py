from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Restaurant

restaurant_routes = Blueprint('restaurants', __name__)

# GET all restaurants
@restaurant_routes.route('/')
def get_restaurants():
    restaurants = Restaurant.query.all()
    return jsonify([r.to_dict() for r in restaurants])

# POST create new restaurant
@restaurant_routes.route('/', methods=['POST'])
@login_required
def create_restaurant():
    data = request.get_json()
    new_restaurant = Restaurant(
        name=data['name'],
        address=data['address'],
        cuisine=data.get('cuisine', ''),
        image_url=data.get('image_url'),
        user_id=current_user.id
    )
    db.session.add(new_restaurant)
    db.session.commit()
    return new_restaurant.to_dict(), 201

# PUT update restaurant
@restaurant_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_restaurant(id):
    restaurant = Restaurant.query.get_or_404(id)
    if restaurant.user_id != current_user.id:
        return {'error': 'Unauthorized'}, 403
    data = request.get_json()
    restaurant.name = data['name']
    restaurant.address = data['address']
    restaurant.cuisine = data.get('cuisine', '')
    restaurant.image_url = data.get('image_url', restaurant.image_url)
    db.session.commit()
    return restaurant.to_dict()

# DELETE restaurant
@restaurant_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_restaurant(id):
    restaurant = Restaurant.query.get_or_404(id)
    if restaurant.user_id != current_user.id:
        return {'error': 'Unauthorized'}, 403
    db.session.delete(restaurant)
    db.session.commit()
    return {'message': 'Deleted successfully'}

@restaurant_routes.route("/user")
@login_required
def get_user_restaurants():
    restaurants = Restaurant.query.filter_by(user_id=current_user.id).all()
    return jsonify([r.to_dict() for r in restaurants])

@restaurant_routes.route('/my-restaurants')
@login_required
def user_restaurants():
    user_restaurants = Restaurant.query.filter_by(user_id=current_user.id).all()
    return jsonify([r.to_dict() for r in user_restaurants])
