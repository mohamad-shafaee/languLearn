import React from "react";
import { useState } from "react";
import { useAuth } from "../auth";
//import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  // local loading state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // disable form after successful submission
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { register } = useAuth();
  const [errors, setErrors] = useState<string[] | null>([]);
  //const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]:e.target.value});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
 
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

    setIsSubmitting(true);
    
    const result = await register(form.email, form.password, form.confirmPassword);
    setIsSubmitting(false);
    if (!result.success) {
            setErrors(result.errors);
            return;
      }
    setIsDisabled(true);
    setMessage("You registered successfully. Please verify the link sent to your email.");
  }; 

  return (
      <form onSubmit={handleSubmit} name="registerForm" autoComplete="off" className="form register"> 
        <div className="title">Register</div> 
        <div className="input-box">
          <div className="label">Email</div>
          <input name="email"
             value={form.email} onChange={handleChange}
             className="input email"
             placeholder="Enter your email" disabled={isSubmitting || isDisabled}/>
        </div>
        <div className="input-box">
          <div className="label">Password</div>
          <input type="password" name="password"
             value={form.password} onChange={handleChange}
             className="input password"
             placeholder="Enter password" disabled={isSubmitting || isDisabled}/>
        </div>
        <div className="input-box">
          <div className="label">Confirm Password</div>
          <input type="password" name="confirmPassword"
             value={form.confirmPassword} onChange={handleChange}
             className="input password"
             placeholder="Confirm password" disabled={isSubmitting || isDisabled}/>
        </div>
        {errors && (<div className="error">{errors.map((err, index) => (<p key={index}>{err}</p>))}</div>)}
          {message && (<div className="msg-class-1">{message}</div>)}
        <button type="submit" className="submit" disabled={isSubmitting || isDisabled}>{isSubmitting ? "sending..." : "Register"}</button> 
      </form> 
  ); 
};

export default Register;
