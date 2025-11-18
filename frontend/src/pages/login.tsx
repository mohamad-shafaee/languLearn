import React, { useState } from "react";
import { useAuth } from "../auth"; 

const Login: React.FC = () => {
  const { setUser, setToken, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      // Optionally redirect after login
      window.location.href = "/profile";
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-page">
      <div className="title">Login</div>
      <div className="block social"> 
      </div>
      <div className="block usual">
              <form onSubmit={handleSubmit} className="login-form">
              {error && <p className="error">{error}</p>}

              <label>Email</label>
              <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
                <div className="box remember-box">
                <div className="input"><input id="remember_me" type="checkbox" name="remember"/></div>
                <div className="label"><label htmlFor="remember_me">Remember Me</label></div>
            </div>

        <button type="submit">Login</button>
      </form>
        <a className="btn-link" href="/request-password">Forget Your Password?</a>
        <a className="btn-link" href="/register">I Want To Register Manually.</a>
      </div>

    </div>
  );
};

export default Login;
