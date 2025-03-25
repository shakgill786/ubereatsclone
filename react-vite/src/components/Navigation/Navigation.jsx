// src/components/Navigation/Navigation.jsx

import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { thunkLogout } from "../../redux/session";
import "./Navigation.css";

function Navigation() {
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(thunkLogout());
  };

  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="navbar-logo">
        <NavLink to="/">
          <img src="/logo.png" alt="App Logo" className="logo" />
        </NavLink>
      </div>

      {/* Center: Title */}
      <div className="navbar-title">Uber Eats Clone</div>

      {/* Right: Auth/Links */}
      <div className="navbar-links">
        <NavLink to="/" className="home-link">
          Home
        </NavLink>

        {user ? (
          <div className="nav-user-info">
            <span>
              Welcome, {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
            </span>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        ) : (
          <>
            <NavLink to="/login" className="auth-link">
              Log In
            </NavLink>
            <NavLink to="/signup" className="auth-link">
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
