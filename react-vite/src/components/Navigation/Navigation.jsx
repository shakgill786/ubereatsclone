// src/components/Navigation/index.jsx
import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useDispatch, useSelector } from "react-redux";
import { thunkLogout } from "../../redux/session";
import "./Navigation.css";
import '@fortawesome/fontawesome-free/css/all.min.css';


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
      {/* Left side: Hamburger and Logo */}
      <div className="navbar-left">
        <button className="menu-button">
          <i className="fa-solid fa-bars"></i>
        </button>
        <NavLink to="/" className="logo-link">
          <img
            src="/ForkYeah.jpg"
            alt="ForkYeah Logo"
            className="logo"
          />
        </NavLink>
      </div>

      {/* Middle: Delivery/Pickup, Location, Search */}
      <div className="navbar-middle">
        <div className="delivery-options">
          <button className="delivery-button">Delivery</button>
          <button className="pickup-button">Pickup</button>
        </div>
        <div className="location">📍 123 App Academy Lane</div>
        <div className="search-bar">
          <input type="text" placeholder="Search ForkYeah!" />
        </div>
      </div>

      {/* Right side: Cart, Login, Signup/Profile */}
      <div className="navbar-right">
        <NavLink to="/cart" className="cart-button">
          <i className="fa-solid fa-cart-shopping"></i>
        </NavLink>

        {user ? (
          <>
            <span className="welcome-user">Hi, {capitalize(user.username)}</span>
            <button className="logout-btn" onClick={logout}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-link">Log In</NavLink>
            <NavLink to="/signup" className="nav-link signup-button">Sign Up</NavLink>
          </>
        )}

        <ProfileButton />
      </div>
    </nav>
  );
}

export default Navigation;
