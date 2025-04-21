from app.models import db, Restaurant, Favorite, MenuItem, Review
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Restaurant, Favorite

restaurant_routes = Blueprint('restaurants', __name__)

# GET all restaurants


@restaurant_routes.route('/')
def get_restaurants():
    restaurants = Restaurant.query.all()
    restaurant_list = []

    for restaurant in restaurants:
        # Calculate average rating and review count for the restaurant
        reviews = Review.query.filter_by(restaurant_id=restaurant.id).all()
        review_count = len(reviews)
        if reviews:
            avg_rating = sum(
                [review.rating for review in reviews]) / review_count
        else:
            avg_rating = None  # No reviews yet

        restaurant_data = restaurant.to_dict()
        restaurant_data['average_rating'] = avg_rating
        restaurant_data['review_count'] = review_count
        restaurant_list.append(restaurant_data)

    return jsonify(restaurant_list)


@restaurant_routes.route("/<int:id>/menu-items", methods=["GET"])
def get_menu_items_for_restaurant(id):
    menu_items = MenuItem.query.filter_by(restaurant_id=id).all()
    return {"menuItems": [item.to_dict() for item in menu_items]}

# Create restaurant


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

# Update restaurant


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

# Delete restaurant


@restaurant_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_restaurant(id):
    restaurant = Restaurant.query.get_or_404(id)
    if restaurant.user_id != current_user.id:
        return {'error': 'Unauthorized'}, 403
    db.session.delete(restaurant)
    db.session.commit()
    return {'message': 'Deleted successfully'}

# Restaurants created by user


@restaurant_routes.route('/my-restaurants')
@login_required
def my_restaurants():
    owned = Restaurant.query.filter_by(user_id=current_user.id).all()
    return jsonify([r.to_dict() for r in owned])

# Restaurants favorited by user


@restaurant_routes.route('/favorites')
@login_required
def favorite_restaurants():
    favorites = Favorite.query.filter_by(user_id=current_user.id).all()
    restaurant_ids = [f.restaurant_id for f in favorites]
    restaurants = Restaurant.query.filter(
        Restaurant.id.in_(restaurant_ids)).all()
    return jsonify([r.to_dict() for r in restaurants])
