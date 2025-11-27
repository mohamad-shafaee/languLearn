import React, { useState } from "react";
import { useAuth } from "../auth";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { setUser, setToken, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[] | null>([]);
  // local loading state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // disable form after successful submission
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);
    if (!result.success) {
            setErrors(result.errors);
            return;
      }
      setIsDisabled(true);
    // Optionally redirect after login
    //window.location.href = "/profile";
    navigate("/profile");
    
  };

  return (
    <div className="login-page">
      <div className="title">Login</div>
      <div className="block social">
      Login by social (Google) after deployment. 
      </div>
      <div className="block usual">
      {errors && (<div className="error">{errors.map((err, index) => (<p key="index">{err}</p>))}</div>)}
      <form onSubmit={handleSubmit} className="login-form">

        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={isSubmitting || isDisabled}/>
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required disabled={isSubmitting || isDisabled}/>
        <div className="box remember-box">
          <div className="input"><input id="remember_me" type="checkbox" name="remember"/></div>
          <div className="label"><label htmlFor="remember_me">Remember Me</label></div>
        </div>
        <button type="submit" disabled={isSubmitting || isDisabled}>{isSubmitting ? "sending..." : "Login"}</button>
      </form>
        <a className="btn-link" href="/reset-password">Forget Your Password?</a>
        <a className="btn-link" href="/register">I Want To Register Manually.</a>
      </div> 
    </div>
  );
};

export default Login;
