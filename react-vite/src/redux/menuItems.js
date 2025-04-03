// react-vite/src/redux/menuItems.js
import { getCookie } from "../utils/csrf";

// Action Types
const LOAD_MENU_ITEMS = "menuItems/LOAD_MENU_ITEMS";
const SET_SINGLE_MENU_ITEM = "menuItems/SET_SINGLE_MENU_ITEM";

// Action Creators
const loadMenuItems = (items) => ({
  type: LOAD_MENU_ITEMS,
  items,
});

const setSingleMenuItem = (item) => ({
  type: SET_SINGLE_MENU_ITEM,
  item,
});

// Thunks
export const getMenuItemsForRestaurantThunk = (restaurantId) => async (dispatch) => {
  const res = await fetch(`/api/restaurants/${restaurantId}/menu-items`);
  if (res.ok) {
    const data = await res.json();
    dispatch(loadMenuItems(data.menuItems));
  }
};

export const getOneMenuItemThunk = (id) => async (dispatch) => {
  const res = await fetch(`/api/menu-items/${id}`);
  if (res.ok) {
    const data = await res.json();
    dispatch(setSingleMenuItem(data));
    return data;
  }
};

// Reducer
const initialState = {
  allMenuItems: [],
  singleMenuItem: null,
};

export default function menuItemsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_MENU_ITEMS:
      return { ...state, allMenuItems: action.items };
    case SET_SINGLE_MENU_ITEM:
      return { ...state, singleMenuItem: action.item };
    default:
      return state;
  }
}
