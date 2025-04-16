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
  try {
    const res = await fetch(`/api/restaurants/${restaurantId}/menu-items`);
    if (res.ok) {
      const data = await res.json();
      dispatch(loadMenuItems(data.menuItems));
    }
  } catch (err) {
    console.error("❌ Failed to load menu items:", err);
  }
};

export const createMenuItemForRestThunk = (itemData) => async (dispatch) => {
  try {
    const res = await fetch(`/api/menu-items/create/${itemData.restaurantId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(itemData),
    });

    const data = await res.json();
    if (res.ok) {
      dispatch(getMenuItemsForRestaurantThunk(itemData.restaurantId));
    }
    return data;
  } catch (err) {
    console.error("❌ Error creating menu item:", err);
    return { errors: ["Menu item creation failed."] };
  }
};

export const getOneMenuItemThunk = (id) => async (dispatch) => {
  try {
    const res = await fetch(`/api/menu-items/${id}`);
    if (res.ok) {
      const data = await res.json();
      dispatch(setSingleMenuItem(data));
      return data;
    } else {
      console.error("Failed to fetch menu item:", res.status);
    }
  } catch (err) {
    console.error("❌ Error in getOneMenuItemThunk:", err);
  }
};
export const updateMenuItemThunk = (menuItem) => async (dispatch) => {
  try {
    const res = await fetch(`/api/menu-items/${menuItem.id}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(menuItem),
    });

    const data = await res.json();
    if (res.ok) {
      dispatch(getMenuItemsForRestaurantThunk(menuItem.restaurantId));
    }
    return data;
  } catch (err) {
    console.error("❌ Error updating menu item:", err);
    return { errors: ["Menu item update failed."] };
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
