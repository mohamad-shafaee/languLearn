import React from "react";
import { useState } from "react";
//import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";


const ResetPass: React.FC = () => {

  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  // local loading state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // disable form after successful submission
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  //const navigate = useNavigate();
  const { requestPassReset, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    

    // Basic validation
    if (!email) {
      setErrors(["Enter your valid Email."]);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors(["Invalid email."]);
      return;
    }

    setIsSubmitting(true);

    const result = await requestPassReset(email); 
    setIsSubmitting(false);
    if (!result.success) {
            setErrors([...result.errors]); 
            return; 
          }
    
    setMessage("Email sent successfully. Please check your email and follow the sent link.");
    setIsDisabled(true);

      // It is better not to redirect authomatically since the user see the message. 
      // It may be good idea to disable input and submit btn.
      
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form">
        <div className="title">Reset Password</div>
        <label>Email</label>
        <input type="email" name="email"
             className="input email"
             placeholder="Enter Email"
          value={email} onChange={e => setEmail(e.target.value)} disabled={isDisabled || isSubmitting} required />
          {errors && (<div className="error">{errors.map((err, index) => (<p key={index}>{err}</p>))}</div>)}
          {message && (<div className="msg-class-1">{message}</div>)}
        <button type="submit" disabled={isDisabled || isSubmitting}>{isSubmitting ? "sending..." : "Submit"}</button>
      </form>
    </>
  );
};

export default ResetPass;
