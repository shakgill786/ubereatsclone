import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword: "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        password,
        first_name: firstName,
        last_name: lastName,
        street_address: streetAddress,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="signup-page-wrapper">
      <h1>Sign Up</h1>

      <form onSubmit={handleSubmit} className="signup-form">
        <div className="name-fields">
          <div className="input-group">
            <label>
              First Name
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </label>
            {errors.first_name && <p className="error">{errors.first_name}</p>}
          </div>

          <div className="input-group">
            <label>
              Last Name
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </label>
            {errors.last_name && <p className="error">{errors.last_name}</p>}
          </div>
        </div>

        <div className="input-group">
          <label>
            Street Address
            <input
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              required
            />
          </label>
          {errors.street_address && (
            <p className="error">{errors.street_address}</p>
          )}
        </div>

        <div className="input-group">
          <label>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="input-group">
          <label>
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          {errors.username && <p className="error">{errors.username}</p>}
        </div>

        <div className="input-group">
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <div className="input-group">
          <label>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormPage;
