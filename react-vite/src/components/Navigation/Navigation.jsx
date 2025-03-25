import { NavLink } from "react-router-dom";
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
      <div className="navbar-logo">
        <NavLink to="/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/96/UNESCO_logo.svg"
            alt="Logo"
            className="logo"
          />
        </NavLink>
      </div>

      <div className="navbar-title">Luxury Eats</div>

      <div className="navbar-links">
        <NavLink to="/">Home</NavLink>

        {user ? (
          <>
            <span className="welcome-user">Welcome, {capitalize(user.username)}</span>
            <button onClick={logout}>Log Out</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Log In</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
