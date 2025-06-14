import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkLogin } from "../../redux/session";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  // single demo-user creds
  const DEMO = { email: "demo@instructor.com", password: "password" };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const serverResponse = await dispatch(
      thunkLogin({ email, password })
    );
    if (serverResponse) setErrors(serverResponse);
    else closeModal();
  };

  const handleDemo = async () => {
    setErrors({});
    const demoResponse = await dispatch(thunkLogin(DEMO));
    if (demoResponse) setErrors(demoResponse);
    else closeModal();
  };

  return (
    <div id="modal">
      <div id="modal-background" onClick={closeModal} />
      <div id="modal-content">
        <div className="login-modal">
          <h1>Log In</h1>
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
            {errors.email && <p className="error">{errors.email}</p>}

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

            <button type="submit" className="login-modal-button">
              Log In
            </button>

            <button
              type="button"
              className="demo-login-button"
              onClick={handleDemo}
            >
              Demo User
            </button>
          </form>
          <button className="close-modal-button" onClick={closeModal}>
            &times;
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginFormModal;
