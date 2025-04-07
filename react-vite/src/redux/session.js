// react-vite/src/redux/session.js

import { getCookie } from "../utils/csrf";

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});

// AUTH THUNK
export const thunkAuthenticate = () => async (dispatch) => {
  try {
    const res = await fetch("/api/auth/", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      if (!data.errors) dispatch(setUser(data));
    }
  } catch (err) {
    console.error("❌ Error in thunkAuthenticate:", err);
  }
};

// LOGIN THUNK
export const thunkLogin = (credentials) => async (dispatch) => {
  const csrfToken = getCookie("csrf_token");
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    if (res.ok) {
      dispatch(setUser(data));
      return null;
    } else {
      console.error("❌ Login failed with:", data);
      return Array.isArray(data.errors)
        ? data.errors
        : Object.values(data.errors).flat();
    }
  } catch (err) {
    console.error("🔥 Exception in thunkLogin:", err);
    return ["An unexpected error occurred. Please try again."];
  }
};

// SIGNUP THUNK
export const thunkSignup = (user) => async (dispatch) => {
  const csrfToken = getCookie("csrf_token");
  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify(user),
    });

    const data = await res.json();

    if (res.ok) {
      dispatch(setUser(data));
      return null;
    } else {
      console.error("❌ Signup failed with:", data);
      return data.errors || ["Signup failed."];
    }
  } catch (err) {
    console.error("🔥 Exception in thunkSignup:", err);
    return ["Server error. Please try again."];
  }
};

// LOGOUT
export const thunkLogout = () => async (dispatch) => {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  await fetch("/api/csrf/restore", {
    credentials: "include",
  });

  dispatch(removeUser());
};

// REDUCER
const initialState = { user: null };

export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
}
