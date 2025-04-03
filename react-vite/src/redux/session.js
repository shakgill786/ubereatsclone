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

export const thunkAuthenticate = () => async (dispatch) => {
  const response = await fetch("/api/auth/", {
    credentials: "include"
  });

  if (response.ok) {
    const data = await response.json();
    if (!data.errors) {
      dispatch(setUser(data));
    }
  }
};

export const thunkLogin = (credentials) => async (dispatch) => {
  const csrfToken = getCookie("csrf_token");

  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
    return null; // ✅ no errors
  } else {
    const data = await response.json();
    if (data?.errors) {
      return Array.isArray(data.errors)
        ? data.errors
        : Object.values(data.errors).flat();
    }
    return ["Login failed. Please try again."];
  }
};

export const thunkSignup = (user) => async (dispatch) => {
  const csrfToken = getCookie("csrf_token");

  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken
    },
    credentials: "include",
    body: JSON.stringify(user)
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorData = await response.json();
    return errorData.errors || ["Signup failed."];
  } else {
    return ["A server error occurred. Please try again."];
  }
};

export const thunkLogout = () => async (dispatch) => {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  // Refresh CSRF
  await fetch("/api/csrf/restore", { credentials: "include" });

  dispatch(removeUser());
};

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
