import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { thunkLogin } from "../../redux/session";
import "./LoginForm.css";

function LoginFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const res = await dispatch(thunkLogin({ email, password }));

    if (res) {
      setErrors(["The provided credentials were invalid"]);
    } else {
      navigate("/");
    }
  };

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    setErrors([]);

    const res = await dispatch(thunkLogin({ email: "demo@aa.io", password: "password" }));

    if (res) {
      setErrors(["Demo login failed."]);
    } else {
      navigate("/");
    }
  };

  const isDisabled = email.length < 4 || password.length < 6;

  return (
    <div className="login-page-container">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} className="login-form">
        {errors.map((err, i) => (
          <p key={i} className="error">{err}</p>
        ))}

        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          className="login-button"
          disabled={isDisabled}
        >
          Log In
        </button>

        {/* ✅ Demo Login Button */}
        <button
          type="button"
          className="demo-login-button"
          onClick={handleDemoLogin}
        >
          Demo User
        </button>
      </form>
    </div>
  );
}

export default LoginFormPage;
