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

// ✅ Thunks

// Get all menu items for a restaurant
export const getMenuItemsForRestaurantThunk = (restaurantId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/restaurants/${restaurantId}/menu-items`);
    if (res.ok) {
      const data = await res.json();
      dispatch(loadMenuItems(data.menuItems));
    } else {
      console.error("❌ Failed to fetch menu items:", res.status);
    }
  } catch (err) {
    console.error("❌ Error fetching menu items:", err);
  }
};

// Create menu item
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

// Get one menu item
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

// Update menu item
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

// Delete menu item
export const deleteMenuItemThunk = (itemId, restaurantId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/menu-items/${itemId}/delete`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      dispatch(getMenuItemsForRestaurantThunk(restaurantId));
    } else {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.error("❌ Error deleting menu item:", err);
    return { errors: ["Menu item deletion failed."] };
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
