import { getCookie } from "../utils/csrf";

const LOAD_REVIEWS = 'reviews/loadReviews';
const CREATE_REVIEW = 'reviews/createReview';
const DELETE_REVIEW = 'reviews/deleteReview';
const UPDATE_REVIEW = 'reviews/updateReview';

const loadReviews = (reviews) => ({
  type: LOAD_REVIEWS,
  payload: reviews
});

const createReview = (review) => ({
  type: CREATE_REVIEW,
  payload: review
});

const deleteReview = (reviewId) => ({
  type: DELETE_REVIEW,
  payload: reviewId
});

const updateReview = (review) => ({
  type: UPDATE_REVIEW,
  payload: review
});

export const thunkLoadReviews = (restaurantId) => async (dispatch) => {
  const csrfToken = getCookie("csrf_token");

  const response = await fetch(`/api/reviews/${restaurantId}`, {
    headers: {
      "X-CSRF-Token": csrfToken
    },
    credentials: "include"
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(loadReviews(data));
  }
};

export const thunkCreateReview = (reviewData) => async (dispatch) => {
  const csrfToken = getCookie("csrf_token");

  const response = await fetch('/api/reviews', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken
    },
    credentials: "include",
    body: JSON.stringify(reviewData)
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(createReview(data));
    return null;
  } else if (response.status === 401) {
    return "Please log in to submit a review";
  } else if (response.status < 500) {
    const errorData = await response.json();
    return errorData.errors || ["Failed to create review"];
  } else {
    return ["A server error occurred. Please try again."];
  }
};

export const thunkDeleteReview = (reviewId) => async (dispatch) => {
  const csrfToken = getCookie("csrf_token");

  const response = await fetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: {
      "X-CSRF-Token": csrfToken
    },
    credentials: "include"
  });

  if (response.ok) {
    dispatch(deleteReview(reviewId));
  }
};

export const thunkUpdateReview = (reviewId, updateData) => async (dispatch) => {
  const csrfToken = getCookie("csrf_token");

  const response = await fetch(`/api/reviews/${reviewId}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken
    },
    credentials: "include",
    body: JSON.stringify(updateData)
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(updateReview(data));
  } else if (response.status < 500) {
    const errorData = await response.json();
    return errorData.errors || ["Failed to update review"];
  } else {
    return ["A server error occurred. Please try again."];
  }
};

const initialState = {
  reviews: {},
  errors: null
};

const reviewsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case LOAD_REVIEWS:
      newState = { ...state };
      newState.reviews = action.payload.reduce((acc, review) => {
        acc[review.id] = review;
        return acc;
      }, {});
      newState.errors = null;
      return newState;

    case CREATE_REVIEW:
      newState = { ...state };
      newState.reviews[action.payload.id] = action.payload;
      newState.errors = null;
      return newState;

    case DELETE_REVIEW:
      newState = { ...state };
      delete newState.reviews[action.payload];
      newState.errors = null;
      return newState;

    case UPDATE_REVIEW:
      newState = { ...state };
      newState.reviews[action.payload.id] = action.payload;
      newState.errors = null;
      return newState;

    default:
      return state;
  }
};

export const selectAllReviews = (state) => state.reviews.reviews;
export const selectReviewById = (state, reviewId) => state.reviews.reviews[reviewId];
export const selectReviewsByRestaurant = (state, restaurantId) => {
  return Object.values(state.reviews.reviews).filter(
    (review) => review.restaurant_id === restaurantId
  );
};

export default reviewsReducer;