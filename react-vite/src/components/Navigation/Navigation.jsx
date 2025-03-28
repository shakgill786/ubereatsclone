import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useDispatch, useSelector } from "react-redux";
import { thunkLogout } from "../../redux/session";
import "./Navigation.css";

function Navigation() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
  };

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <nav className="navbar">
      {/* Left logo */}
      <div className="navbar-logo">
        <NavLink to="/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/96/UNESCO_logo.svg"
            alt="Logo"
            className="logo"
          />
        </NavLink>
      </div>

      {/* Center title */}
      <div className="navbar-title">Luxury Eats</div>

      {/* Right nav links */}
      <div className="navbar-links">
        <NavLink to="/" className="nav-link">Home</NavLink>

        {user ? (
          <>
            <span className="welcome-user">Welcome, {capitalize(user.username)}</span>
            <button className="logout-btn" onClick={logout}>Log Out</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-link">Log In</NavLink>
            <NavLink to="/signup" className="nav-link">Sign Up</NavLink>
          </>
        )}

        <ProfileButton />
      </div>
    </nav>
  );
}

export default Navigation;
