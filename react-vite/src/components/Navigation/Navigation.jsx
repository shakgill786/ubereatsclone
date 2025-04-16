// src/components/Navigation.jsx
import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useDispatch, useSelector } from "react-redux";
import { thunkLogout } from "../../redux/session";
import { useShoppingCart } from "../../context/ShoppingCart";
import "./Navigation.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

function Navigation() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const { cart } = useShoppingCart();

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
      <div className="navbar-left">
        <button className="menu-button">
          <i className="fa-solid fa-bars"></i>
        </button>
        <NavLink to="/" className="logo-link">
          <img src="/ForkYeah.jpg" alt="ForkYeah Logo" className="logo" />
        </NavLink>
      </div>

      <h1 className="site-title">🍴 ForkYeah</h1>

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

      <div className="navbar-right">
        <NavLink to="/cart" className="cart-button">
          <i className="fa-solid fa-cart-shopping"></i>
          {cart?.length > 0 && (
            <span className="cart-count-badge">{cart.length}</span>
          )}
        </NavLink>

        {user ? (
          <>
            <span className="welcome-user">Hi, {capitalize(user.username)}</span>
            <NavLink to="/dashboard" className="dashboard-link">
              Dashboard
            </NavLink>
            <button className="logout-btn" onClick={logout}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-link">Log In</NavLink>
            <NavLink to="/signup" className="signup-button">Sign Up</NavLink>
          </>
        )}

        <ProfileButton />
      </div>
    </nav>
  );
}

export default Navigation;
