// react-vite/src/components/LoginFormPage/LoginFormPage.jsx

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

    if (res?.errors) {
      const messages = Array.isArray(res.errors)
        ? res.errors
        : Object.values(res.errors).flat();
      setErrors(messages);
    } else {
      navigate("/");
    }
  };

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

        <button type="submit" className="login-button">Log In</button>
      </form>
    </div>
  );
}

export default LoginFormPage;
