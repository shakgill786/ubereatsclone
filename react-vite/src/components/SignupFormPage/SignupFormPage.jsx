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
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        password,
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
<<<<<<< Updated upstream
      {errors.server && <p>{errors.server}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p>{errors.email}</p>}
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p>{errors.username}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
=======
      <form onSubmit={handleSubmit} className="signup-form">

        <div className="name-fields">
          <div className="input-group">
            <label>First Name</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            {errors.first_name && <p className="error">{errors.first_name}</p>}
          </div>

          <div className="input-group">
            <label>Last Name</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            {errors.last_name && <p className="error">{errors.last_name}</p>}
          </div>
        </div>

        <label>Street Address</label>
        <input value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} required />
        {errors.street_address && <p className="error">{errors.street_address}</p>}

        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} required />
        {errors.email && <p className="error">{errors.email}</p>}

        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        {errors.username && <p className="error">{errors.username}</p>}

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {errors.password && <p className="error">{errors.password}</p>}

        <label>Confirm Password</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

>>>>>>> Stashed changes
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormPage;
