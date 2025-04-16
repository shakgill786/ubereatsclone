// react-vite/src/redux/restaurant.js

// Action Type
const LOAD_RESTAURANTS = "restaurants/LOAD_RESTAURANTS";

// Action Creator
const loadRestaurants = (restaurants) => ({
  type: LOAD_RESTAURANTS,
  restaurants,
});

// Thunks
export const getAllRestaurantsWithOneMenuItemThunk = () => async (dispatch) => {
  const res = await fetch(`/api/restaurants`);
  if (res.ok) {
    const data = await res.json();
    dispatch(loadRestaurants(data));
    return data;
  } else {
    console.error("Failed to fetch restaurants");
  }
};

// ✅ Added this
export const getOneRestaurantThunk = (id) => async (dispatch) => {
  try {
    const res = await fetch(`/api/restaurants/${id}`);
    if (res.ok) {
      const data = await res.json();
      // optional: dispatch to set single restaurant in state
      return data;
    } else {
      console.error("❌ Failed to fetch restaurant:", res.status);
    }
  } catch (err) {
    console.error("❌ Error in getOneRestaurantThunk:", err);
  }
};

// Reducer
const initialState = {
  allRestaurants: {},
};

export default function restaurantReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_RESTAURANTS:
      const newState = { allRestaurants: {} };
      action.restaurants.forEach((rest) => {
        newState.allRestaurants[rest.id] = rest;
      });
      return newState;
    default:
      return state;
  }
}
