import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreateReview, thunkLoadReviews, thunkDeleteReview, thunkUpdateReview } from "../../redux/reviews";
import { selectReviewsByRestaurant } from "../../redux/reviews";
import "./RestaurantDetailPage.css";

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [restaurant, setRestaurant] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);
  const reviews = useSelector(state => selectReviewsByRestaurant(state, parseInt(id)));

  useEffect(() => {
    if(errors.length > 0){
      setTimeout(() => {
        setErrors([]);
      }, 3000);
    }
  }, [errors]);

  useEffect(() => {
    fetch(`/api/restaurants`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((r) => r.id === parseInt(id));
        if (found) setRestaurant(found);
      });
  }, [id]);

  useEffect(() => {
    if (id) {
      dispatch(thunkLoadReviews(parseInt(id)));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (sessionUser && reviews.length > 0) {
      const userReview = reviews.find(review => review.user_id === sessionUser.id);
      setHasReviewed(!!userReview);
    }
  }, [reviews, sessionUser]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (!sessionUser) {
      setErrors(["Please log in to submit a review"]);
      return;
    }

    if (!rating) {
      setErrors(["Please select a rating"]);
      return;
    }

    if (!comment.trim()) {
      setErrors(["Please write a review"]);
      return;
    }

    const reviewData = {
      comment,
      rating,
      restaurant_id: restaurant.id
    };

    const result = await dispatch(thunkCreateReview(reviewData));
    
    if (result) {
      // Handle both string and object error responses
      if (typeof result === 'string') {
        setErrors([result]);
      } else if (result.errors) {
        setErrors(Array.isArray(result.errors) ? result.errors : [result.errors]);
      } else if (result.message) {
        setErrors([result.message]);
      } else {
        setErrors(["An error occurred while creating the review"]);
      }
    } else {
      setRating(0);
      setComment("");
      dispatch(thunkLoadReviews(restaurant.id));
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditRating(0);
    setEditComment("");
  };

  const handleUpdateReview = async (reviewId) => {
    setErrors([]);

    if (!editRating) {
      setErrors(["Please select a rating"]);
      return;
    }

    if (!editComment.trim()) {
      setErrors(["Please write a review"]);
      return;
    }

    const reviewData = {
      comment: editComment,
      rating: editRating
    };

    const result = await dispatch(thunkUpdateReview(reviewId, reviewData));
    
    if (result) {
      setErrors([result]);
    } else {
      setEditingReview(null);
      setEditRating(0);
      setEditComment("");
      dispatch(thunkLoadReviews(parseInt(id)));
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const result = await dispatch(thunkDeleteReview(reviewId));
    if (result) {
      setErrors([result]);
    } else {
      dispatch(thunkLoadReviews(parseInt(id)));
    }
  };

  if (!restaurant) return <p>Loading...</p>;

  return (
    <div className="restaurant-detail">
      <img src={restaurant.image_url || "/restaurant-placeholder.jpg"} alt={restaurant.name} />
      <h2>{restaurant.name}</h2>
      <p><strong>Address:</strong> {restaurant.address}</p>
      <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
      <Link to={`/restaurants/${restaurant.id}/edit`}>
        <button className="edit-btn">Edit</button>
      </Link>

      <div className="review-section">
        <div className="review-header">
          <h3>Reviews</h3>
          <span className="review-count">{reviews.length} reviews</span>
        </div>

        {sessionUser ? (
          <div className="add-review-box">
            {hasReviewed ? (
              <div className="already-reviewed">
                <p>You have already reviewed this restaurant.</p>
                <p>You can edit your existing review instead.</p>
              </div>
            ) : (
              <>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <label key={star}>
                      <input
                        type="radio"
                        className="star-rating-item"
                        name="rating"
                        value={star}
                        checked={rating === star}
                        onChange={(e) => setRating(parseInt(e.target.value))}
                      />
                      <span style={{ filter: rating >= star ? 'grayscale(0%)' : 'grayscale(100%)' }}>⭐</span>
                    </label>
                  ))}
                </div>
                <textarea
                  className="review-input"
                  placeholder="Write your review here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                {errors.length > 0 && (
                  <div className="error-messages">
                    {errors.map((error, idx) => (
                      <p key={idx} className="error">{error}</p>
                    ))}
                  </div>
                )}
                <button 
                  className="btn btn-primary"
                  onClick={handleSubmitReview}
                >
                  Submit Review
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="login-prompt">
            <p>Please <Link to="/login">login</Link> to leave a review</p>
          </div>
        )}

        <div className="review-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="user-info">
                  <span>{review?.user?.username}</span>
                </div>
                {editingReview === review.id ? (
                  <div className="review-actions">
                    <button 
                      className="save-review-btn"
                      onClick={() => handleUpdateReview(review.id)}
                    >
                      Save
                    </button>
                    <button 
                      className="cancel-review-btn"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                ) : sessionUser && sessionUser.id === review.user_id ? (
                  <div className="review-actions">
                    <button 
                      className="edit-review-btn"
                      onClick={() => handleEditReview(review)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-review-btn"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
              </div>
              {editingReview === review.id ? (
                <div className="edit-review-form">
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <label key={star}>
                        <input
                          type="radio"
                          className="star-rating-item"
                          name="edit-rating"
                          value={star}
                          checked={editRating === star}
                          onChange={(e) => setEditRating(parseInt(e.target.value))}
                        />
                        <span style={{ filter: editRating >= star ? 'grayscale(0%)' : 'grayscale(100%)' }}>⭐</span>
                      </label>
                    ))}
                  </div>
                  <textarea
                    className="review-input"
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    placeholder="Write your review here..."
                  />
                </div>
              ) : (
                <>
                  <div className="review-rating">
                    {Array(review.rating).fill('⭐').join('')}
                  </div>
                  <div className="review-text">
                    {review.comment}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
