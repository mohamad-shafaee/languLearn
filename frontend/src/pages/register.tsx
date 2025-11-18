import React from "react";
import { useState } from "react";
import { useAuth } from "../auth";

const Register: React.FC = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { register } = useAuth();
  const [errors, setErrors] = useState<string[] | null>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]:e.target.value});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    console.log("I am here");

    // Basic validation
    if (!form.email || !form.password || !form.confirmPassword) {
      setErrors(["Something went wrong."]);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setErrors(["Invalid email."]);
      return;
    }
    if (form.password.length < 6) {
      setErrors(["Password must be at least 6 characters."]);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErrors(["Passwords do not match."]);
      return;
    }
    //now information should be passed to backend.
          const result = await register(form.email, form.password, form.confirmPassword);
          if (!result.success) {
            setErrors(result.errors);
            return;
          }
      // Optionally redirect after login
      window.location.href = "/profile";
    

  };


  return (
    <>
      <form onSubmit={handleSubmit} name="registerForm" autoComplete="off" className="form register">
        <div className="title">Register</div>
        <div className="input-box">
          <div className="label">Email</div>
          <input name="email"
             value={form.email} onChange={handleChange}
             className="input email"
             placeholder="Enter your email"/>
        </div>
        <div className="input-box">
          <div className="label">Password</div>
          <input type="password" name="password"
             value={form.password} onChange={handleChange}
             className="input password"
             placeholder="Enter password"/>
        </div>
        <div className="input-box">
          <div className="label">Confirm Password</div>
          <input type="password" name="confirmPassword"
             value={form.confirmPassword} onChange={handleChange}
             className="input password"
             placeholder="Confirm password"/>
        </div>
        {errors && (<div className="error">{errors.map((err, index) => (<p key="index">{err}</p>))}</div>)}
        <button type="submit" className="submit">Register</button>

      </form>
    </>
  );
};

export default Register;
