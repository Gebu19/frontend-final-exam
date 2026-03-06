import { useRef, useState } from "react";
import { useUser } from "../contexts/UserProvider";
import { Navigate } from "react-router-dom";

export default function Login() {
  const [controlState, setControlState] = useState({ isLoggingIn: false, isLoginError: false, isLoginOk: false });
  const emailRef = useRef();
  const passRef = useRef();
  const { user, login } = useUser();

  async function onLogin() {
    setControlState(prev => ({ ...prev, isLoggingIn: true }));
    const result = await login(emailRef.current.value, passRef.current.value);
    setControlState({ isLoggingIn: false, isLoginError: !result, isLoginOk: result });
  }

  if (user.isLoggedIn) return <Navigate to="/books" replace />;

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '10vh' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', color: 'var(--primary)' }}>System Login</h2>
        <div style={{ marginBottom: '15px' }}>
          <label>Email</label>
          <input className="input" type="text" ref={emailRef} placeholder="admin@test.com" />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password</label>
          <input className="input" type="password" ref={passRef} placeholder="******" />
        </div>
        <button className="btn" style={{ width: '100%' }} onClick={onLogin} disabled={controlState.isLoggingIn}>
          {controlState.isLoggingIn ? "Logging in..." : "Login"}
        </button>
        {controlState.isLoginError && <p style={{ color: 'var(--danger)', marginTop: '10px' }}>Login incorrect</p>}
      </div>
    </div>
  );
}