import React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";


const NewPassPage: React.FC = () => {

  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [form, setForm] = useState({pasword: "", confirmPassword: ""});
  const [errors, setErrors] = useState<string[] | null>([]);
  // local loading state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // disable form after successful submission
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setNewPassword, loading } = useAuth();
  useEffect(()=>{
    const params = new URLSearchParams(location.search);
    setToken(params.get("token"));
    setEmail(params.get("email"));
  }, [location.search]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    if (!token || !email) {
      setErrors(["Invalid password reset link."]);
      return;
    }

    // Basic validation
    if (!form.password || !form.confirmPassword) {
      setErrors(["Enter password and confirm it."]);
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

    const res = await setNewPassword(email, token, form.password, form.confirmPassword);
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
    <div className="reset-pass-page">
      <div className="title">Reset Password</div>
      {errors && (<div className="error">{errors.map((err, index) => (<p key="index">{err}</p>))}</div>)}
      <form onSubmit={handleSubmit} className="reset-pass-form">
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

export default NewPassPage;
