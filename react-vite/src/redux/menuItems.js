// redux/menuItems.js

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

export const createMenuItemForRestThunk = (itemData) => async (dispatch) => {
  const res = await fetch(`/api/restaurants/${itemData.restaurantId}/menu-items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
    credentials: "include",
  });

  const data = await res.json();
  if (res.ok) {
    dispatch(getMenuItemsForRestaurantThunk(itemData.restaurantId));
  }
  return data;
};

export const updateMenuItemThunk = (menuItem) => async (dispatch) => {
  const res = await fetch(`/api/menu-items/${menuItem.id}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(menuItem),
    credentials: "include",
  });

  const data = await res.json();
  if (res.ok) {
    dispatch(getMenuItemsForRestaurantThunk(menuItem.restaurantId));
  }
  return data;
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
