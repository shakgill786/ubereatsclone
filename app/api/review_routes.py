from flask import Blueprint, request, jsonify, abort
from flask_login import login_required, current_user
from app.models import db, Review, Restaurant, User

# localhost:8000/api/review
review_routes = Blueprint('review', __name__)

# GET all restaurants
@review_routes.route('/')
def get_reviews():
    allReviews = Review.query.all()
    if not allReviews:
        return {'errors': ['No reviews found']}, 404
    return jsonify([r.to_dict() for r in allReviews])


# Add New Review
@review_routes.route('/', methods=['POST'])
@login_required
def create_review():
    """
    Create a new review
    
    Required fields in request body:
    - comment: str (max 255 characters)
    - rating: int (1-5)
    - restaurant_id: int
    """
    if not current_user.is_authenticated:
        return {'errors': ['Authentication required']}, 401

    data = request.get_json()
    
    # Validate required fields
    if not all(key in data for key in ['comment', 'rating', 'restaurant_id']):
        return {'errors': 'Missing required fields'}, 400
    
    # Validate rating range
    if not 1 <= data['rating'] <= 5:
        return {'errors': 'Rating must be between 1 and 5'}, 400
    
    # Check if restaurant exists
    restaurant = Restaurant.query.get(data['restaurant_id'])
    if not restaurant:
        return {'errors': 'Restaurant not found'}, 404
    
    # Check if user already has a review for this restaurant
    existing_review = Review.query.filter_by(
        restaurant_id=data['restaurant_id'],
        user_id=current_user.id
    ).first()
    
    if existing_review:
        return {'errors': 'You have already reviewed this restaurant'}, 400
    
    # Create new review
    review = Review(
        comment=data['comment'],
        rating=data['rating'],
        restaurant_id=data['restaurant_id'],
        user_id=current_user.id
    )
    
    try:
        db.session.add(review)
        db.session.commit()
        return review.to_dict(), 201
    except Exception as e:
        db.session.rollback()
        return {'errors': [str(e)]}, 400


# Get Reviews of a Restaurant
@review_routes.route('/<int:restaurant_id>', methods=['GET'])
def get_reviews_by_restaurant(restaurant_id):
    """
    Get all reviews for a specific restaurant
    
    Args:
        restaurant_id (int): ID of the restaurant
    """
    # Check if restaurant exists
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return {'errors': ['Restaurant not found']}, 404
    
    # Get all reviews for this restaurant
    reviews = Review.query.filter_by(restaurant_id=restaurant_id).all()
    
    # Convert reviews to dictionary format and include user information
    reviews_dict = []
    for review in reviews:
        review_data = review.to_dict()
        user = User.query.get(review.user_id)
        if user:
            review_data['user'] = {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        reviews_dict.append(review_data)
    
    return jsonify(reviews_dict)


# Delete Review
@review_routes.route('/<int:review_id>', methods=['DELETE'])
@login_required
def delete_review(review_id):
    """
    Delete a review
    
    Args:
        review_id (int): ID of the review to delete
    """
    # Get the review
    review = Review.query.get(review_id)
    
    if not review:
        return {'errors': ['Review not found']}, 404
    
    # Check if current user is authorized to delete
    if review.user_id != current_user.id:
        return {'errors': ['Unauthorized']}, 403
    
    try:
        db.session.delete(review)
        db.session.commit()
        return {'message': 'Review deleted successfully'}, 200
    except Exception as e:
        db.session.rollback()
        return {'errors': [str(e)]}, 400


# Update Review
@review_routes.route('/<int:review_id>', methods=['PUT'])
@login_required
def update_review(review_id):
    """
    Update a review
    
    Args:
        review_id (int): ID of the review to update
    """
    # Get the review
    review = Review.query.get(review_id)
    
    if not review:
        return {'errors': ['Review not found']}, 404
    
    # Check if current user is authorized to update
    if review.user_id != current_user.id:
        return {'errors': ['Unauthorized']}, 403
    
    data = request.get_json()
    
    # Validate required fields
    if not all(key in data for key in ['comment', 'rating']):
        return {'errors': 'Missing required fields'}, 400
    
    # Validate rating range
    if not 1 <= data['rating'] <= 5:
        return {'errors': 'Rating must be between 1 and 5'}, 400
    
    try:
        review.comment = data['comment']
        review.rating = data['rating']
        db.session.commit()
        
        # Get updated user information
        user = User.query.get(review.user_id)
        review_data = review.to_dict()
        if user:
            review_data['user'] = {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        
        return review_data, 200
    except Exception as e:
        db.session.rollback()
        return {'errors': [str(e)]}, 400