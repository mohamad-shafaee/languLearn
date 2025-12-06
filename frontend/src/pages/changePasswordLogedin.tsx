import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";


const ChangePasswordLogedin: React.FC = () => {

  const { changePasswordLogedin } = useAuth();
  
  const [form, setForm] = useState({email: "", oldPassword: "" , password: "", confirmPassword: ""});
  const [errors, setErrors] = useState<string[] | null>([]);
  // local loading state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // disable form after successful submission
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    if (!form.email || !form.oldPassword || !form.password || !form.confirmPassword) {
      setErrors(["Complete all fields!"]);
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

    const result = await changePasswordLogedin(form.email, form.oldPassword, form.password, form.confirmPassword);
    setIsSubmitting(false);
    if (!result.success) {
            setErrors(result.errors);
            return;
          }
      
      setIsDisabled(true);
      // Optionally redirect after login
      navigate("/login");
  };


  return (
    <div className="w-1/2">
      <div className="title">Change Password</div>
      {errors && (<div className="error">{errors.map((err, index) => (<p key="index">{err}</p>))}</div>)}
      <form onSubmit={handleSubmit} className="change-pass-form">
          <div className="input-box">
          <div className="label">Email</div>
          <input name="email"
             value={form.email} onChange={handleFormChange}
             className="input email"
             placeholder="Enter your email" disabled={isSubmitting || isDisabled}/>
          </div>
          <div className="input-box">
          <div className="label">Old Password</div>
          <input type="password" name="oldPassword"
             value={form.oldPassword} onChange={handleFormChange}
             className="input password"
             placeholder="Enter old password" disabled={isSubmitting || isDisabled}/>
          </div>

          <div className="input-box">
          <div className="label">Password</div>
          <input type="password" name="password"
             value={form.password} onChange={handleFormChange}
             className="input password"
             placeholder="Enter new password" disabled={isSubmitting || isDisabled}/>
        </div>
        <div className="input-box">
          <div className="label">Confirm Password</div>
          <input type="password" name="confirmPassword"
             value={form.confirmPassword} onChange={handleFormChange}
             className="input password"
             placeholder="Confirm new password" disabled={isSubmitting || isDisabled}/>
        </div>
        <button type="submit" disabled={isSubmitting || isDisabled}>{isSubmitting ? "sending..." : "Submit"}</button>
      </form>
    </div>
  );
};

export default ChangePasswordLogedin;
